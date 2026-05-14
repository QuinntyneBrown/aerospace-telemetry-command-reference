using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ninja.Application.Common.Models;
using Ninja.Application.Features.Tenants;

namespace Ninja.Api.Controllers;

[Route("api/v1/tenants")]
[Authorize]
public sealed class TenantsController(ISender sender) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<TenantDto>>> GetTenants(CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new GetTenantsQuery(), cancellationToken));
    }

    [HttpGet("{tenantSlug}")]
    public async Task<ActionResult<TenantDto>> GetTenant(string tenantSlug, CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new GetTenantBySlugQuery(tenantSlug), cancellationToken));
    }
}
