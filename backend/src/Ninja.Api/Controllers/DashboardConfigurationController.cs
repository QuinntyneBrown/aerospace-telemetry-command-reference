using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ninja.Application.Common.Models;
using Ninja.Application.Features.DashboardConfiguration;

namespace Ninja.Api.Controllers;

[Authorize]
public sealed class DashboardConfigurationController(ISender sender) : BaseApiController
{
    [HttpGet("api/v1/dashboard-configuration/{tenantSlug}")]
    public async Task<ActionResult<DashboardConfigurationDto>> GetConfiguration(string tenantSlug, CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new GetDashboardConfigurationQuery(tenantSlug), cancellationToken));
    }

    [HttpGet("api/v1/dashboard-layouts/{tenantSlug}")]
    public async Task<ActionResult<DashboardLayoutDto>> GetLayout(string tenantSlug, CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new GetDashboardLayoutQuery(tenantSlug), cancellationToken));
    }

    [HttpPut("api/v1/dashboard-layouts/{tenantSlug}")]
    public async Task<ActionResult<DashboardLayoutDto>> SaveLayout(string tenantSlug, SaveDashboardLayoutRequest request, CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new SaveDashboardLayoutCommand(tenantSlug, request.LayoutJson), cancellationToken));
    }
}

public sealed record SaveDashboardLayoutRequest(string LayoutJson);
