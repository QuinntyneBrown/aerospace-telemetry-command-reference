using MediatR;
using Ninja.Application.Common;
using Ninja.Application.Common.Abstractions;
using Ninja.Application.Common.Errors;
using Ninja.Application.Common.Models;
using Ninja.Application.Common.Security;

namespace Ninja.Application.Features.Tenants;

public sealed record GetTenantsQuery : IRequest<Result<IReadOnlyCollection<TenantDto>>>;

public sealed class GetTenantsQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetTenantsQuery, Result<IReadOnlyCollection<TenantDto>>>
{
    public Task<Result<IReadOnlyCollection<TenantDto>>> Handle(GetTenantsQuery request, CancellationToken cancellationToken)
    {
        var tenants = dbContext.Tenants
            .OrderBy(tenant => tenant.DisplayName)
            .Select(tenant => tenant.ToDto())
            .ToArray();

        return Task.FromResult(Result<IReadOnlyCollection<TenantDto>>.Success(tenants));
    }
}

public sealed record GetTenantBySlugQuery(string TenantSlug)
    : IRequest<Result<TenantDto>>, IAuthorizeRequest
{
    public string RequiredPermission => Permissions.ViewTenant;
}

public sealed class GetTenantBySlugQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetTenantBySlugQuery, Result<TenantDto>>
{
    public Task<Result<TenantDto>> Handle(GetTenantBySlugQuery request, CancellationToken cancellationToken)
    {
        var tenantResult = dbContext.FindTenant(request.TenantSlug);

        return Task.FromResult(tenantResult.IsSuccess
            ? Result<TenantDto>.Success(tenantResult.Value!.ToDto())
            : Result<TenantDto>.Failure(tenantResult.Errors));
    }
}
