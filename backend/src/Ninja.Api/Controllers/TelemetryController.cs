using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ninja.Application.Common.Models;
using Ninja.Application.Features.Telemetry;

namespace Ninja.Api.Controllers;

[Route("api/v1/tenants/{tenantSlug}/machines/{machineId:guid}/telemetry")]
[Authorize]
public sealed class TelemetryController(ISender sender) : BaseApiController
{
    [HttpGet("latest")]
    public async Task<ActionResult<IReadOnlyCollection<TelemetrySampleDto>>> GetLatest(string tenantSlug, Guid machineId, CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new GetLatestTelemetryQuery(tenantSlug, machineId), cancellationToken));
    }

    [HttpGet("history")]
    public async Task<ActionResult<IReadOnlyCollection<TelemetrySampleDto>>> GetHistory(
        string tenantSlug,
        Guid machineId,
        DateTimeOffset? from,
        DateTimeOffset? to,
        string? metricKey,
        CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(new GetTelemetryHistoryQuery(tenantSlug, machineId, from, to, metricKey), cancellationToken));
    }

    [HttpPost]
    public async Task<ActionResult<TelemetrySampleDto>> RecordTelemetry(
        string tenantSlug,
        Guid machineId,
        RecordTelemetrySampleRequest request,
        CancellationToken cancellationToken)
    {
        return FromResult(await sender.Send(
            new RecordTelemetrySampleCommand(
                tenantSlug,
                machineId,
                request.StreamKey,
                request.MetricKey,
                request.NumericValue,
                request.TextValue,
                request.Latitude,
                request.Longitude,
                request.HeadingDegrees),
            cancellationToken));
    }
}

public sealed record RecordTelemetrySampleRequest(
    string StreamKey,
    string MetricKey,
    decimal? NumericValue,
    string? TextValue,
    decimal? Latitude,
    decimal? Longitude,
    decimal? HeadingDegrees);
