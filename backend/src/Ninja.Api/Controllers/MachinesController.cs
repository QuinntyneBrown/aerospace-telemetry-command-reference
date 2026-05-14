using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ninja.Application.Common.Models;
using Ninja.Application.Features.Machines;

namespace Ninja.Api.Controllers;

[Route("api/v1/tenants/{tenantSlug}/machines")]
[Authorize]
public sealed class MachinesController(ISender sender) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<MachineDto>>> GetMachines(string tenantSlug, CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new GetMachinesQuery(tenantSlug), cancellationToken));
    }

    [HttpGet("{machineId:guid}")]
    public async Task<ActionResult<MachineDto>> GetMachine(string tenantSlug, Guid machineId, CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new GetMachineByIdQuery(tenantSlug, machineId), cancellationToken));
    }
}
