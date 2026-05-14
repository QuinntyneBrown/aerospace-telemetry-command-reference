using Ninja.Domain.Common;
using Ninja.Domain.Events;
using Ninja.Domain.ValueObjects;

namespace Ninja.Domain.Entities;

public sealed class TelemetrySample : Entity
{
    private TelemetrySample()
    {
        StreamKey = string.Empty;
        MetricKey = string.Empty;
    }

    public TelemetrySample(
        Guid id,
        TenantId tenantId,
        MachineId machineId,
        string streamKey,
        string metricKey,
        decimal? numericValue,
        string? textValue,
        GeoPosition? position,
        DateTimeOffset recordedAt)
    {
        if (string.IsNullOrWhiteSpace(streamKey))
        {
            throw new ArgumentException("Stream key is required.", nameof(streamKey));
        }

        if (string.IsNullOrWhiteSpace(metricKey))
        {
            throw new ArgumentException("Metric key is required.", nameof(metricKey));
        }

        Id = id;
        TenantId = tenantId;
        MachineId = machineId;
        StreamKey = streamKey.Trim();
        MetricKey = metricKey.Trim();
        NumericValue = numericValue;
        TextValue = string.IsNullOrWhiteSpace(textValue) ? null : textValue.Trim();
        Position = position?.Normalize();
        RecordedAt = recordedAt;

        AddDomainEvent(new TelemetrySampleRecorded(TenantId, MachineId, StreamKey, RecordedAt));
    }

    public Guid Id { get; private set; }

    public TenantId TenantId { get; private set; }

    public MachineId MachineId { get; private set; }

    public string StreamKey { get; private set; }

    public string MetricKey { get; private set; }

    public decimal? NumericValue { get; private set; }

    public string? TextValue { get; private set; }

    public GeoPosition? Position { get; private set; }

    public DateTimeOffset RecordedAt { get; private set; }
}
