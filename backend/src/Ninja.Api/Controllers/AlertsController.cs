using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ninja.Application.Common.Models;
using Ninja.Application.Features.Alerts;

namespace Ninja.Api.Controllers;

[Route("api/v1/tenants/{tenantSlug}/alerts")]
[Authorize]
public sealed class AlertsController(ISender sender) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<AlertDto>>> GetAlerts(string tenantSlug, CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new GetAlertsQuery(tenantSlug), cancellationToken));
    }

    [HttpPost("{alertId:guid}/resolve")]
    public async Task<ActionResult<AlertDto>> ResolveAlert(string tenantSlug, Guid alertId, CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new ResolveAlertCommand(tenantSlug, alertId), cancellationToken));
    }
}
