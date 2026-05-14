using MediatR;
using Ninja.Application.Common;
using Ninja.Application.Common.Abstractions;
using Ninja.Application.Common.Errors;
using Ninja.Application.Common.Models;
using Ninja.Application.Common.Security;

namespace Ninja.Application.Features.Alerts;

public sealed record GetAlertsQuery(string TenantSlug)
    : IRequest<Result<IReadOnlyCollection<AlertDto>>>, IAuthorizeRequest
{
    public string RequiredPermission => Permissions.ViewTelemetry;
}

public sealed class GetAlertsQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetAlertsQuery, Result<IReadOnlyCollection<AlertDto>>>
{
    public Task<Result<IReadOnlyCollection<AlertDto>>> Handle(GetAlertsQuery request, CancellationToken cancellationToken)
    {
        var tenantResult = dbContext.FindTenant(request.TenantSlug);
        if (!tenantResult.IsSuccess)
        {
            return Task.FromResult(Result<IReadOnlyCollection<AlertDto>>.Failure(tenantResult.Errors));
        }

        var tenant = tenantResult.Value!;
        var alerts = dbContext.Alerts
            .Where(alert => alert.TenantId == tenant.Id)
            .OrderBy(alert => alert.IsResolved)
            .ThenByDescending(alert => alert.RaisedAt)
            .Take(100)
            .Select(alert => alert.ToDto(tenant.Slug.Value))
            .ToArray();

        return Task.FromResult(Result<IReadOnlyCollection<AlertDto>>.Success(alerts));
    }
}

public sealed record ResolveAlertCommand(string TenantSlug, Guid AlertId)
    : IRequest<Result<AlertDto>>, IAuthorizeRequest, ITransactionalRequest
{
    public string RequiredPermission => Permissions.AcknowledgeAlerts;
}

public sealed class ResolveAlertCommandHandler(
    IApplicationDbContext dbContext,
    IDateTimeProvider dateTimeProvider,
    IAlertPublisher alertPublisher)
    : IRequestHandler<ResolveAlertCommand, Result<AlertDto>>
{
    public async Task<Result<AlertDto>> Handle(ResolveAlertCommand request, CancellationToken cancellationToken)
    {
        var tenantResult = dbContext.FindTenant(request.TenantSlug);
        if (!tenantResult.IsSuccess)
        {
            return Result<AlertDto>.Failure(tenantResult.Errors);
        }

        var tenant = tenantResult.Value!;
        var alert = dbContext.Alerts.FirstOrDefault(candidate => candidate.TenantId == tenant.Id && candidate.Id == request.AlertId);
        if (alert is null)
        {
            return Result<AlertDto>.Failure(ApplicationError.NotFound("alert.not_found", "Alert was not found."));
        }

        alert.Resolve(dateTimeProvider.UtcNow);
        var dto = alert.ToDto(tenant.Slug.Value);
        await alertPublisher.PublishAlertAsync(dto, cancellationToken);

        return Result<AlertDto>.Success(dto);
    }
}
