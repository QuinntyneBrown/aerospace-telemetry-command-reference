using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ninja.Application.Common.Models;
using Ninja.Application.Features.Commands;

namespace Ninja.Api.Controllers;

[Route("api/v1/tenants/{tenantSlug}")]
[Authorize]
public sealed class CommandsController(ISender sender) : BaseApiController
{
    [HttpGet("commands/definitions")]
    public async Task<ActionResult<IReadOnlyCollection<CommandDefinitionDto>>> GetDefinitions(string tenantSlug, CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new GetCommandDefinitionsQuery(tenantSlug), cancellationToken));
    }

    [HttpPost("machines/{machineId:guid}/commands")]
    public async Task<ActionResult<CommandExecutionDto>> RequestCommand(
        string tenantSlug,
        Guid machineId,
        RequestCommandRequest request,
        CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new RequestCommandCommand(tenantSlug, machineId, request.CommandKey, request.PayloadJson), cancellationToken));
    }

    [HttpGet("commands/{commandExecutionId:guid}")]
    public async Task<ActionResult<CommandExecutionDto>> GetStatus(string tenantSlug, Guid commandExecutionId, CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new GetCommandStatusQuery(tenantSlug, commandExecutionId), cancellationToken));
    }

    [HttpGet("commands/history")]
    public async Task<ActionResult<IReadOnlyCollection<CommandExecutionDto>>> GetHistory(string tenantSlug, CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new GetCommandHistoryQuery(tenantSlug), cancellationToken));
    }
}

public sealed record RequestCommandRequest(string CommandKey, string PayloadJson);
