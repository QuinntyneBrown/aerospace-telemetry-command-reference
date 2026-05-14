using MediatR;
using Ninja.Application.Common;
using Ninja.Application.Common.Abstractions;
using Ninja.Application.Common.Behaviors;
using Ninja.Application.Common.Errors;
using Ninja.Application.Common.Models;
using Ninja.Application.Common.Security;
using Ninja.Domain.Entities;
using Ninja.Domain.ValueObjects;

namespace Ninja.Application.Features.Commands;

public sealed record GetCommandDefinitionsQuery(string TenantSlug)
    : IRequest<Result<IReadOnlyCollection<CommandDefinitionDto>>>, IAuthorizeRequest
{
    public string RequiredPermission => Permissions.ViewTenant;
}

public sealed class GetCommandDefinitionsQueryHandler(IApplicationDbContext dbContext, ICurrentUser currentUser)
    : IRequestHandler<GetCommandDefinitionsQuery, Result<IReadOnlyCollection<CommandDefinitionDto>>>
{
    public Task<Result<IReadOnlyCollection<CommandDefinitionDto>>> Handle(GetCommandDefinitionsQuery request, CancellationToken cancellationToken)
    {
        var tenantResult = dbContext.FindTenant(request.TenantSlug);
        if (!tenantResult.IsSuccess)
        {
            return Task.FromResult(Result<IReadOnlyCollection<CommandDefinitionDto>>.Failure(tenantResult.Errors));
        }

        var tenant = tenantResult.Value!;
        var commands = dbContext.CommandDefinitions
            .Where(command => command.TenantId == tenant.Id)
            .OrderBy(command => command.DisplayName)
            .Select(command => command.ToDto(currentUser.HasPermission(command.RequiredPermission)))
            .ToArray();

        return Task.FromResult(Result<IReadOnlyCollection<CommandDefinitionDto>>.Success(commands));
    }
}

public sealed record RequestCommandCommand(string TenantSlug, Guid MachineId, string CommandKey, string PayloadJson)
    : IRequest<Result<CommandExecutionDto>>, IAuthorizeRequest, ITransactionalRequest
{
    public string RequiredPermission => Permissions.ExecuteCommand;
}

public sealed class RequestCommandCommandValidator : IRequestValidator<RequestCommandCommand>
{
    public IReadOnlyCollection<ApplicationError> Validate(RequestCommandCommand request)
    {
        var errors = new List<ApplicationError>();

        if (string.IsNullOrWhiteSpace(request.TenantSlug))
        {
            errors.Add(ApplicationError.Validation("tenant_slug.required", "Tenant slug is required."));
        }

        if (request.MachineId == Guid.Empty)
        {
            errors.Add(ApplicationError.Validation("machine_id.required", "Machine id is required."));
        }

        if (string.IsNullOrWhiteSpace(request.CommandKey))
        {
            errors.Add(ApplicationError.Validation("command_key.required", "Command key is required."));
        }

        return errors;
    }
}

public sealed class RequestCommandCommandHandler(
    IApplicationDbContext dbContext,
    ICurrentUser currentUser,
    IDateTimeProvider dateTimeProvider,
    ICommandGateway commandGateway,
    ICommandStatusPublisher commandStatusPublisher,
    IOperationalEventPublisher operationalEventPublisher)
    : IRequestHandler<RequestCommandCommand, Result<CommandExecutionDto>>
{
    public async Task<Result<CommandExecutionDto>> Handle(RequestCommandCommand request, CancellationToken cancellationToken)
    {
        var tenantResult = dbContext.FindTenant(request.TenantSlug);
        if (!tenantResult.IsSuccess)
        {
            return Result<CommandExecutionDto>.Failure(tenantResult.Errors);
        }

        var tenant = tenantResult.Value!;
        var machineResult = dbContext.FindMachine(tenant, request.MachineId);
        if (!machineResult.IsSuccess)
        {
            return Result<CommandExecutionDto>.Failure(machineResult.Errors);
        }

        var definition = dbContext.CommandDefinitions.FirstOrDefault(command =>
            command.TenantId == tenant.Id && command.Key == request.CommandKey);

        if (definition is null)
        {
            return Result<CommandExecutionDto>.Failure(
                ApplicationError.NotFound("command_definition.not_found", $"Command '{request.CommandKey}' was not found."));
        }

        if (!currentUser.HasPermission(definition.RequiredPermission))
        {
            return Result<CommandExecutionDto>.Failure(
                ApplicationError.Forbidden("command.permission_forbidden", "The user cannot execute this command definition."));
        }

        var now = dateTimeProvider.UtcNow;
        var execution = CommandExecution.Request(
            CommandExecutionId.New(),
            tenant.Id,
            new MachineId(request.MachineId),
            request.CommandKey,
            request.PayloadJson,
            currentUser.UserId,
            now);

        await dbContext.AddCommandExecutionAsync(execution, cancellationToken);
        await RecordAndPublishEventAsync(tenant.Slug.Value, tenant.Id, execution.MachineId, "command.requested", $"Command '{request.CommandKey}' requested.", cancellationToken);
        await PublishCommandAsync(tenant.Slug.Value, execution, cancellationToken);

        var gatewayResult = await commandGateway.SendAsync(
            new CommandDispatchRequest(
                tenant.Slug.Value,
                tenant.Id.Value,
                request.MachineId,
                execution.Id.Value,
                request.CommandKey,
                request.PayloadJson),
            cancellationToken);

        if (!gatewayResult.Accepted)
        {
            execution.Reject(gatewayResult.RejectionReason ?? "Command rejected by gateway.", dateTimeProvider.UtcNow);
            await RecordAndPublishEventAsync(tenant.Slug.Value, tenant.Id, execution.MachineId, "command.rejected", execution.FailureReason!, cancellationToken);
            await PublishCommandAsync(tenant.Slug.Value, execution, cancellationToken);
            return Result<CommandExecutionDto>.Success(execution.ToDto(tenant.Slug.Value));
        }

        execution.Accept(dateTimeProvider.UtcNow);
        await RecordAndPublishEventAsync(tenant.Slug.Value, tenant.Id, execution.MachineId, "command.accepted", $"Command '{request.CommandKey}' accepted.", cancellationToken);
        await PublishCommandAsync(tenant.Slug.Value, execution, cancellationToken);

        if (!string.IsNullOrWhiteSpace(gatewayResult.FailureReason))
        {
            execution.Fail(gatewayResult.FailureReason, dateTimeProvider.UtcNow);
            await RecordAndPublishEventAsync(tenant.Slug.Value, tenant.Id, execution.MachineId, "command.failed", execution.FailureReason!, cancellationToken);
            await PublishCommandAsync(tenant.Slug.Value, execution, cancellationToken);
            return Result<CommandExecutionDto>.Success(execution.ToDto(tenant.Slug.Value));
        }

        if (gatewayResult.Completed)
        {
            execution.Complete(dateTimeProvider.UtcNow);
            await RecordAndPublishEventAsync(tenant.Slug.Value, tenant.Id, execution.MachineId, "command.completed", $"Command '{request.CommandKey}' completed.", cancellationToken);
            await PublishCommandAsync(tenant.Slug.Value, execution, cancellationToken);
        }

        return Result<CommandExecutionDto>.Success(execution.ToDto(tenant.Slug.Value));
    }

    private async Task RecordAndPublishEventAsync(
        string tenantSlug,
        TenantId tenantId,
        MachineId machineId,
        string type,
        string message,
        CancellationToken cancellationToken)
    {
        var operationalEvent = new OperationalEvent(Guid.NewGuid(), tenantId, machineId, type, message, dateTimeProvider.UtcNow);
        await dbContext.AddOperationalEventAsync(operationalEvent, cancellationToken);
        await operationalEventPublisher.PublishOperationalEventAsync(operationalEvent.ToDto(tenantSlug), cancellationToken);
    }

    private Task PublishCommandAsync(string tenantSlug, CommandExecution execution, CancellationToken cancellationToken)
    {
        return commandStatusPublisher.PublishCommandStatusAsync(
            new CommandStatusUpdateDto(tenantSlug, execution.MachineId.Value, execution.Id.Value, execution.Status, execution.FailureReason),
            cancellationToken);
    }
}

public sealed record GetCommandStatusQuery(string TenantSlug, Guid CommandExecutionId)
    : IRequest<Result<CommandExecutionDto>>, IAuthorizeRequest
{
    public string RequiredPermission => Permissions.ViewTenant;
}

public sealed class GetCommandStatusQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetCommandStatusQuery, Result<CommandExecutionDto>>
{
    public Task<Result<CommandExecutionDto>> Handle(GetCommandStatusQuery request, CancellationToken cancellationToken)
    {
        var tenantResult = dbContext.FindTenant(request.TenantSlug);
        if (!tenantResult.IsSuccess)
        {
            return Task.FromResult(Result<CommandExecutionDto>.Failure(tenantResult.Errors));
        }

        var tenant = tenantResult.Value!;
        var id = new CommandExecutionId(request.CommandExecutionId);
        var execution = dbContext.CommandExecutions.FirstOrDefault(command => command.TenantId == tenant.Id && command.Id == id);

        return Task.FromResult(execution is null
            ? Result<CommandExecutionDto>.Failure(ApplicationError.NotFound("command.not_found", "Command execution was not found."))
            : Result<CommandExecutionDto>.Success(execution.ToDto(tenant.Slug.Value)));
    }
}

public sealed record GetCommandHistoryQuery(string TenantSlug)
    : IRequest<Result<IReadOnlyCollection<CommandExecutionDto>>>, IAuthorizeRequest
{
    public string RequiredPermission => Permissions.ViewTenant;
}

public sealed class GetCommandHistoryQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetCommandHistoryQuery, Result<IReadOnlyCollection<CommandExecutionDto>>>
{
    public Task<Result<IReadOnlyCollection<CommandExecutionDto>>> Handle(GetCommandHistoryQuery request, CancellationToken cancellationToken)
    {
        var tenantResult = dbContext.FindTenant(request.TenantSlug);
        if (!tenantResult.IsSuccess)
        {
            return Task.FromResult(Result<IReadOnlyCollection<CommandExecutionDto>>.Failure(tenantResult.Errors));
        }

        var tenant = tenantResult.Value!;
        var history = dbContext.CommandExecutions
            .Where(command => command.TenantId == tenant.Id)
            .OrderByDescending(command => command.RequestedAt)
            .Take(100)
            .Select(command => command.ToDto(tenant.Slug.Value))
            .ToArray();

        return Task.FromResult(Result<IReadOnlyCollection<CommandExecutionDto>>.Success(history));
    }
}
