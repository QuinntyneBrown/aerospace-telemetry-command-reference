using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ninja.Application.Common.Models;
using Ninja.Application.Features.Simulation;

namespace Ninja.Api.Controllers;

[Route("api/v1/simulation/{tenantSlug}")]
[Authorize]
public sealed class SimulationController(ISender sender) : BaseApiController
{
    [HttpPost("start")]
    public async Task<ActionResult<SimulationStatusDto>> Start(string tenantSlug, CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new StartSimulationCommand(tenantSlug), cancellationToken));
    }

    [HttpPost("stop")]
    public async Task<ActionResult<SimulationStatusDto>> Stop(string tenantSlug, CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new StopSimulationCommand(tenantSlug), cancellationToken));
    }
}
