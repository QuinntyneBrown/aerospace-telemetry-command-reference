using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ninja.Application.Common.Models;
using Ninja.Application.Features.Events;

namespace Ninja.Api.Controllers;

[Route("api/v1/tenants/{tenantSlug}/events")]
[Authorize]
public sealed class EventsController(ISender sender) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<OperationalEventDto>>> GetEvents(string tenantSlug, CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new GetEventsQuery(tenantSlug), cancellationToken));
    }
}
