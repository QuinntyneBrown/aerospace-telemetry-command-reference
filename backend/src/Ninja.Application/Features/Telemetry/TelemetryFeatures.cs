using MediatR;
using Ninja.Application.Common;
using Ninja.Application.Common.Abstractions;
using Ninja.Application.Common.Behaviors;
using Ninja.Application.Common.Errors;
using Ninja.Application.Common.Models;
using Ninja.Application.Common.Security;
using Ninja.Domain.Entities;
using Ninja.Domain.ValueObjects;

namespace Ninja.Application.Features.Telemetry;

public sealed record GetLatestTelemetryQuery(string TenantSlug, Guid MachineId)
    : IRequest<Result<IReadOnlyCollection<TelemetrySampleDto>>>, IAuthorizeRequest
{
    public string RequiredPermission => Permissions.ViewTelemetry;
}

public sealed class GetLatestTelemetryQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetLatestTelemetryQuery, Result<IReadOnlyCollection<TelemetrySampleDto>>>
{
    public Task<Result<IReadOnlyCollection<TelemetrySampleDto>>> Handle(GetLatestTelemetryQuery request, CancellationToken cancellationToken)
    {
        var tenantResult = dbContext.FindTenant(request.TenantSlug);
        if (!tenantResult.IsSuccess)
        {
            return Task.FromResult(Result<IReadOnlyCollection<TelemetrySampleDto>>.Failure(tenantResult.Errors));
        }

        var tenant = tenantResult.Value!;
        var machineResult = dbContext.FindMachine(tenant, request.MachineId);
        if (!machineResult.IsSuccess)
        {
            return Task.FromResult(Result<IReadOnlyCollection<TelemetrySampleDto>>.Failure(machineResult.Errors));
        }

        var machineId = new MachineId(request.MachineId);
        var samples = dbContext.TelemetrySamples
            .Where(sample => sample.TenantId == tenant.Id && sample.MachineId == machineId)
            .AsEnumerable()
            .GroupBy(sample => sample.MetricKey)
            .Select(group => group.OrderByDescending(sample => sample.RecordedAt).First())
            .OrderBy(sample => sample.MetricKey)
            .Select(sample => sample.ToDto(tenant.Slug.Value))
            .ToArray();

        return Task.FromResult(Result<IReadOnlyCollection<TelemetrySampleDto>>.Success(samples));
    }
}

public sealed record GetTelemetryHistoryQuery(string TenantSlug, Guid MachineId, DateTimeOffset? From, DateTimeOffset? To, string? MetricKey)
    : IRequest<Result<IReadOnlyCollection<TelemetrySampleDto>>>, IAuthorizeRequest
{
    public string RequiredPermission => Permissions.ViewTelemetry;
}

public sealed class GetTelemetryHistoryQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetTelemetryHistoryQuery, Result<IReadOnlyCollection<TelemetrySampleDto>>>
{
    public Task<Result<IReadOnlyCollection<TelemetrySampleDto>>> Handle(GetTelemetryHistoryQuery request, CancellationToken cancellationToken)
    {
        var tenantResult = dbContext.FindTenant(request.TenantSlug);
        if (!tenantResult.IsSuccess)
        {
            return Task.FromResult(Result<IReadOnlyCollection<TelemetrySampleDto>>.Failure(tenantResult.Errors));
        }

        var tenant = tenantResult.Value!;
        var machineResult = dbContext.FindMachine(tenant, request.MachineId);
        if (!machineResult.IsSuccess)
        {
            return Task.FromResult(Result<IReadOnlyCollection<TelemetrySampleDto>>.Failure(machineResult.Errors));
        }

        var machineId = new MachineId(request.MachineId);
        var samples = dbContext.TelemetrySamples
            .Where(sample => sample.TenantId == tenant.Id && sample.MachineId == machineId);

        if (request.From is not null)
        {
            samples = samples.Where(sample => sample.RecordedAt >= request.From.Value);
        }

        if (request.To is not null)
        {
            samples = samples.Where(sample => sample.RecordedAt <= request.To.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.MetricKey))
        {
            samples = samples.Where(sample => sample.MetricKey == request.MetricKey);
        }

        var result = samples
            .OrderByDescending(sample => sample.RecordedAt)
            .Take(500)
            .Select(sample => sample.ToDto(tenant.Slug.Value))
            .ToArray();

        return Task.FromResult(Result<IReadOnlyCollection<TelemetrySampleDto>>.Success(result));
    }
}

public sealed record RecordTelemetrySampleCommand(
    string TenantSlug,
    Guid MachineId,
    string StreamKey,
    string MetricKey,
    decimal? NumericValue,
    string? TextValue,
    decimal? Latitude,
    decimal? Longitude,
    decimal? HeadingDegrees)
    : IRequest<Result<TelemetrySampleDto>>, IAuthorizeRequest, ITransactionalRequest
{
    public string RequiredPermission => Permissions.ViewTelemetry;
}

public sealed class RecordTelemetrySampleCommandValidator : IRequestValidator<RecordTelemetrySampleCommand>
{
    public IReadOnlyCollection<ApplicationError> Validate(RecordTelemetrySampleCommand request)
    {
        var errors = new List<ApplicationError>();

        if (string.IsNullOrWhiteSpace(request.TenantSlug))
        {
            errors.Add(ApplicationError.Validation("tenant_slug.required", "Tenant slug is required."));
        }

        if (request.MachineId == Guid.Empty)
        {
            errors.Add(ApplicationError.Validation("machine_id.required", "Machine id is required."));
        }

        if (string.IsNullOrWhiteSpace(request.StreamKey))
        {
            errors.Add(ApplicationError.Validation("stream_key.required", "Telemetry stream key is required."));
        }

        if (string.IsNullOrWhiteSpace(request.MetricKey))
        {
            errors.Add(ApplicationError.Validation("metric_key.required", "Metric key is required."));
        }

        if (request.NumericValue is null && string.IsNullOrWhiteSpace(request.TextValue) && (request.Latitude is null || request.Longitude is null))
        {
            errors.Add(ApplicationError.Validation("telemetry.value_required", "A numeric, text, or position value is required."));
        }

        return errors;
    }
}

public sealed class RecordTelemetrySampleCommandHandler(
    IApplicationDbContext dbContext,
    IDateTimeProvider dateTimeProvider,
    ITelemetryPublisher telemetryPublisher)
    : IRequestHandler<RecordTelemetrySampleCommand, Result<TelemetrySampleDto>>
{
    public async Task<Result<TelemetrySampleDto>> Handle(RecordTelemetrySampleCommand request, CancellationToken cancellationToken)
    {
        var tenantResult = dbContext.FindTenant(request.TenantSlug);
        if (!tenantResult.IsSuccess)
        {
            return Result<TelemetrySampleDto>.Failure(tenantResult.Errors);
        }

        var tenant = tenantResult.Value!;
        var machineResult = dbContext.FindMachine(tenant, request.MachineId);
        if (!machineResult.IsSuccess)
        {
            return Result<TelemetrySampleDto>.Failure(machineResult.Errors);
        }

        var streamExists = dbContext.TelemetryStreams.Any(stream => stream.TenantId == tenant.Id && stream.Key == request.StreamKey);
        if (!streamExists)
        {
            return Result<TelemetrySampleDto>.Failure(
                ApplicationError.NotFound("telemetry_stream.not_found", $"Telemetry stream '{request.StreamKey}' was not found."));
        }

        var position = request.Latitude is not null && request.Longitude is not null
            ? new GeoPosition(request.Latitude.Value, request.Longitude.Value, request.HeadingDegrees)
            : null;

        var sample = new TelemetrySample(
            Guid.NewGuid(),
            tenant.Id,
            new MachineId(request.MachineId),
            request.StreamKey,
            request.MetricKey,
            request.NumericValue,
            request.TextValue,
            position,
            dateTimeProvider.UtcNow);

        await dbContext.AddTelemetrySampleAsync(sample, cancellationToken);

        var dto = sample.ToDto(tenant.Slug.Value);
        await telemetryPublisher.PublishTelemetryAsync(new TelemetryUpdateDto(tenant.Slug.Value, request.MachineId, dto), cancellationToken);

        return Result<TelemetrySampleDto>.Success(dto);
    }
}
