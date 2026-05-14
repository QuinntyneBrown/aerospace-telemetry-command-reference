using MediatR;
using Ninja.Application.Common;
using Ninja.Application.Common.Abstractions;
using Ninja.Application.Common.Errors;
using Ninja.Application.Common.Models;
using Ninja.Application.Common.Security;

namespace Ninja.Application.Features.Events;

public sealed record GetEventsQuery(string TenantSlug)
    : IRequest<Result<IReadOnlyCollection<OperationalEventDto>>>, IAuthorizeRequest
{
    public string RequiredPermission => Permissions.ViewTenant;
}

public sealed class GetEventsQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetEventsQuery, Result<IReadOnlyCollection<OperationalEventDto>>>
{
    public Task<Result<IReadOnlyCollection<OperationalEventDto>>> Handle(GetEventsQuery request, CancellationToken cancellationToken)
    {
        var tenantResult = dbContext.FindTenant(request.TenantSlug);
        if (!tenantResult.IsSuccess)
        {
            return Task.FromResult(Result<IReadOnlyCollection<OperationalEventDto>>.Failure(tenantResult.Errors));
        }

        var tenant = tenantResult.Value!;
        var events = dbContext.OperationalEvents
            .Where(operationalEvent => operationalEvent.TenantId == tenant.Id)
            .OrderByDescending(operationalEvent => operationalEvent.OccurredAt)
            .Take(100)
            .Select(operationalEvent => operationalEvent.ToDto(tenant.Slug.Value))
            .ToArray();

        return Task.FromResult(Result<IReadOnlyCollection<OperationalEventDto>>.Success(events));
    }
}
