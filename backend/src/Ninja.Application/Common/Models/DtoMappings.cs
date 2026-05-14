using Ninja.Domain.Entities;

namespace Ninja.Application.Common.Models;

public static class DtoMappings
{
    public static TenantDto ToDto(this Tenant tenant)
    {
        return new TenantDto(
            tenant.Id.Value,
            tenant.Slug.Value,
            tenant.DisplayName,
            new BrandMetadataDto(
                tenant.Brand.DisplayName,
                tenant.Brand.PrimaryColor,
                tenant.Brand.AccentColor,
                tenant.Brand.LogoText,
                tenant.Brand.Terminology));
    }

    public static MachineDto ToDto(this Machine machine, string tenantSlug)
    {
        return new MachineDto(
            machine.Id.Value,
            tenantSlug,
            machine.Name,
            machine.Model,
            machine.Status,
            new GeoPositionDto(machine.Position.Latitude, machine.Position.Longitude, machine.Position.HeadingDegrees),
            new BatteryStateDto(machine.Battery.Percent, machine.Battery.IsCharging),
            machine.MissionState,
            machine.UpdatedAt);
    }

    public static TelemetryStreamDto ToDto(this TelemetryStream stream)
    {
        return new TelemetryStreamDto(stream.Id.Value, stream.Key, stream.DisplayName, stream.Unit, stream.ValueKind);
    }

    public static CommandDefinitionDto ToDto(this CommandDefinition definition, bool isVisible)
    {
        return new CommandDefinitionDto(
            definition.Id,
            definition.Key,
            definition.DisplayName,
            definition.RequiredPermission,
            definition.IsDangerous,
            definition.PayloadSchemaJson,
            isVisible);
    }

    public static DashboardLayoutDto ToDto(this DashboardLayout layout, string tenantSlug)
    {
        return new DashboardLayoutDto(layout.Id.Value, tenantSlug, layout.LayoutJson, layout.UpdatedBy, layout.UpdatedAt);
    }

    public static TelemetrySampleDto ToDto(this TelemetrySample sample, string tenantSlug)
    {
        return new TelemetrySampleDto(
            sample.Id,
            tenantSlug,
            sample.MachineId.Value,
            sample.StreamKey,
            sample.MetricKey,
            sample.NumericValue,
            sample.TextValue,
            sample.Position is null
                ? null
                : new GeoPositionDto(sample.Position.Latitude, sample.Position.Longitude, sample.Position.HeadingDegrees),
            sample.RecordedAt);
    }

    public static CommandExecutionDto ToDto(this CommandExecution execution, string tenantSlug)
    {
        return new CommandExecutionDto(
            execution.Id.Value,
            tenantSlug,
            execution.MachineId.Value,
            execution.CommandKey,
            execution.PayloadJson,
            execution.RequestedBy,
            execution.RequestedAt,
            execution.CompletedAt,
            execution.Status,
            execution.FailureReason);
    }

    public static OperationalEventDto ToDto(this OperationalEvent operationalEvent, string tenantSlug)
    {
        return new OperationalEventDto(
            operationalEvent.Id,
            tenantSlug,
            operationalEvent.MachineId?.Value,
            operationalEvent.Type,
            operationalEvent.Message,
            operationalEvent.OccurredAt);
    }

    public static AlertDto ToDto(this Alert alert, string tenantSlug)
    {
        return new AlertDto(
            alert.Id,
            tenantSlug,
            alert.MachineId?.Value,
            alert.Severity,
            alert.Title,
            alert.Message,
            alert.RaisedAt,
            alert.IsResolved,
            alert.ResolvedAt);
    }
}
