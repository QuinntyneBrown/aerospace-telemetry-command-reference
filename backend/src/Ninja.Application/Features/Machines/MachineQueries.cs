using MediatR;
using Ninja.Application.Common;
using Ninja.Application.Common.Abstractions;
using Ninja.Application.Common.Errors;
using Ninja.Application.Common.Models;
using Ninja.Application.Common.Security;
using Ninja.Domain.ValueObjects;

namespace Ninja.Application.Features.Machines;

public sealed record GetMachinesQuery(string TenantSlug)
    : IRequest<Result<IReadOnlyCollection<MachineDto>>>, IAuthorizeRequest
{
    public string RequiredPermission => Permissions.ViewTelemetry;
}

public sealed class GetMachinesQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetMachinesQuery, Result<IReadOnlyCollection<MachineDto>>>
{
    public Task<Result<IReadOnlyCollection<MachineDto>>> Handle(GetMachinesQuery request, CancellationToken cancellationToken)
    {
        var tenantResult = dbContext.FindTenant(request.TenantSlug);
        if (!tenantResult.IsSuccess)
        {
            return Task.FromResult(Result<IReadOnlyCollection<MachineDto>>.Failure(tenantResult.Errors));
        }

        var tenant = tenantResult.Value!;
        var machines = dbContext.Machines
            .Where(machine => machine.TenantId == tenant.Id)
            .OrderBy(machine => machine.Name)
            .Select(machine => machine.ToDto(tenant.Slug.Value))
            .ToArray();

        return Task.FromResult(Result<IReadOnlyCollection<MachineDto>>.Success(machines));
    }
}

public sealed record GetMachineByIdQuery(string TenantSlug, Guid MachineId)
    : IRequest<Result<MachineDto>>, IAuthorizeRequest
{
    public string RequiredPermission => Permissions.ViewTelemetry;
}

public sealed class GetMachineByIdQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetMachineByIdQuery, Result<MachineDto>>
{
    public Task<Result<MachineDto>> Handle(GetMachineByIdQuery request, CancellationToken cancellationToken)
    {
        var tenantResult = dbContext.FindTenant(request.TenantSlug);
        if (!tenantResult.IsSuccess)
        {
            return Task.FromResult(Result<MachineDto>.Failure(tenantResult.Errors));
        }

        var tenant = tenantResult.Value!;
        var machineId = new MachineId(request.MachineId);
        var machine = dbContext.Machines.FirstOrDefault(candidate => candidate.TenantId == tenant.Id && candidate.Id == machineId);

        return Task.FromResult(machine is null
            ? Result<MachineDto>.Failure(ApplicationError.NotFound("machine.not_found", $"Machine '{request.MachineId}' was not found."))
            : Result<MachineDto>.Success(machine.ToDto(tenant.Slug.Value)));
    }
}
