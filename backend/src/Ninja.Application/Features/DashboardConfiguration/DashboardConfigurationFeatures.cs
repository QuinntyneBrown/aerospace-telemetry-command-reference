using MediatR;
using Ninja.Application.Common;
using Ninja.Application.Common.Abstractions;
using Ninja.Application.Common.Behaviors;
using Ninja.Application.Common.Errors;
using Ninja.Application.Common.Models;
using Ninja.Application.Common.Security;
using Ninja.Domain.Entities;
using Ninja.Domain.ValueObjects;

namespace Ninja.Application.Features.DashboardConfiguration;

public sealed record GetDashboardConfigurationQuery(string TenantSlug)
    : IRequest<Result<DashboardConfigurationDto>>, IAuthorizeRequest
{
    public string RequiredPermission => Permissions.ViewTenant;
}

public sealed class GetDashboardConfigurationQueryHandler(IApplicationDbContext dbContext, ICurrentUser currentUser)
    : IRequestHandler<GetDashboardConfigurationQuery, Result<DashboardConfigurationDto>>
{
    public Task<Result<DashboardConfigurationDto>> Handle(GetDashboardConfigurationQuery request, CancellationToken cancellationToken)
    {
        var tenantResult = dbContext.FindTenant(request.TenantSlug);
        if (!tenantResult.IsSuccess)
        {
            return Task.FromResult(Result<DashboardConfigurationDto>.Failure(tenantResult.Errors));
        }

        var tenant = tenantResult.Value!;
        var layout = dbContext.DashboardLayouts.FirstOrDefault(candidate => candidate.TenantId == tenant.Id);
        if (layout is null)
        {
            return Task.FromResult(Result<DashboardConfigurationDto>.Failure(
                ApplicationError.NotFound("dashboard_layout.not_found", "Dashboard layout was not found.")));
        }

        var navigation = dbContext.NavigationItems
            .Where(item => item.TenantId == tenant.Id)
            .OrderBy(item => item.SortOrder)
            .Select(item => new NavigationItemDto(item.Label, item.Route, item.Icon, item.SortOrder))
            .ToArray();

        var featureFlags = dbContext.FeatureFlags
            .Where(flag => flag.TenantId == tenant.Id)
            .OrderBy(flag => flag.Key)
            .Select(flag => new FeatureFlagDto(flag.Key, flag.Enabled))
            .ToArray();

        var streams = dbContext.TelemetryStreams
            .Where(stream => stream.TenantId == tenant.Id)
            .OrderBy(stream => stream.DisplayName)
            .Select(stream => stream.ToDto())
            .ToArray();

        var commands = dbContext.CommandDefinitions
            .Where(command => command.TenantId == tenant.Id)
            .OrderBy(command => command.DisplayName)
            .Select(command => command.ToDto(currentUser.HasPermission(command.RequiredPermission)))
            .ToArray();

        var configuration = new DashboardConfigurationDto(
            tenant.ToDto(),
            navigation,
            featureFlags,
            streams,
            commands,
            layout.ToDto(tenant.Slug.Value));

        return Task.FromResult(Result<DashboardConfigurationDto>.Success(configuration));
    }
}

public sealed record GetDashboardLayoutQuery(string TenantSlug)
    : IRequest<Result<DashboardLayoutDto>>, IAuthorizeRequest
{
    public string RequiredPermission => Permissions.ViewTenant;
}

public sealed class GetDashboardLayoutQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetDashboardLayoutQuery, Result<DashboardLayoutDto>>
{
    public Task<Result<DashboardLayoutDto>> Handle(GetDashboardLayoutQuery request, CancellationToken cancellationToken)
    {
        var tenantResult = dbContext.FindTenant(request.TenantSlug);
        if (!tenantResult.IsSuccess)
        {
            return Task.FromResult(Result<DashboardLayoutDto>.Failure(tenantResult.Errors));
        }

        var tenant = tenantResult.Value!;
        var layout = dbContext.DashboardLayouts.FirstOrDefault(candidate => candidate.TenantId == tenant.Id);

        return Task.FromResult(layout is null
            ? Result<DashboardLayoutDto>.Failure(ApplicationError.NotFound("dashboard_layout.not_found", "Dashboard layout was not found."))
            : Result<DashboardLayoutDto>.Success(layout.ToDto(tenant.Slug.Value)));
    }
}

public sealed record SaveDashboardLayoutCommand(string TenantSlug, string LayoutJson)
    : IRequest<Result<DashboardLayoutDto>>, IAuthorizeRequest, ITransactionalRequest
{
    public string RequiredPermission => Permissions.ManageDashboardLayout;
}

public sealed class SaveDashboardLayoutCommandValidator : IRequestValidator<SaveDashboardLayoutCommand>
{
    public IReadOnlyCollection<ApplicationError> Validate(SaveDashboardLayoutCommand request)
    {
        var errors = new List<ApplicationError>();

        if (string.IsNullOrWhiteSpace(request.TenantSlug))
        {
            errors.Add(ApplicationError.Validation("tenant_slug.required", "Tenant slug is required."));
        }

        if (string.IsNullOrWhiteSpace(request.LayoutJson))
        {
            errors.Add(ApplicationError.Validation("layout.required", "Layout JSON is required."));
        }

        return errors;
    }
}

public sealed class SaveDashboardLayoutCommandHandler(
    IApplicationDbContext dbContext,
    ICurrentUser currentUser,
    IDateTimeProvider dateTimeProvider)
    : IRequestHandler<SaveDashboardLayoutCommand, Result<DashboardLayoutDto>>
{
    public async Task<Result<DashboardLayoutDto>> Handle(SaveDashboardLayoutCommand request, CancellationToken cancellationToken)
    {
        var tenantResult = dbContext.FindTenant(request.TenantSlug);
        if (!tenantResult.IsSuccess)
        {
            return Result<DashboardLayoutDto>.Failure(tenantResult.Errors);
        }

        var tenant = tenantResult.Value!;
        var layout = dbContext.DashboardLayouts.FirstOrDefault(candidate => candidate.TenantId == tenant.Id);

        if (layout is null)
        {
            layout = new DashboardLayout(
                DashboardLayoutId.New(),
                tenant.Id,
                request.LayoutJson,
                currentUser.UserId,
                dateTimeProvider.UtcNow);

            await dbContext.AddDashboardLayoutAsync(layout, cancellationToken);
        }
        else
        {
            layout.Update(request.LayoutJson, currentUser.UserId, dateTimeProvider.UtcNow);
        }

        return Result<DashboardLayoutDto>.Success(layout.ToDto(tenant.Slug.Value));
    }
}
