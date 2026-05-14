using Ninja.Domain.Enums;

namespace Ninja.Application.Common.Models;

public sealed record BrandMetadataDto(
    string DisplayName,
    string PrimaryColor,
    string AccentColor,
    string LogoText,
    string Terminology);

public sealed record TenantDto(Guid Id, string Slug, string DisplayName, BrandMetadataDto Brand);

public sealed record NavigationItemDto(string Label, string Route, string Icon, int SortOrder);

public sealed record FeatureFlagDto(string Key, bool Enabled);

public sealed record TelemetryStreamDto(Guid Id, string Key, string DisplayName, string Unit, string ValueKind);

public sealed record CommandDefinitionDto(
    Guid Id,
    string Key,
    string DisplayName,
    string RequiredPermission,
    bool IsDangerous,
    string PayloadSchemaJson,
    bool IsVisible);

public sealed record DashboardLayoutDto(Guid Id, string TenantSlug, string LayoutJson, string UpdatedBy, DateTimeOffset UpdatedAt);

public sealed record DashboardConfigurationDto(
    TenantDto Tenant,
    IReadOnlyCollection<NavigationItemDto> Navigation,
    IReadOnlyCollection<FeatureFlagDto> FeatureFlags,
    IReadOnlyCollection<TelemetryStreamDto> TelemetryStreams,
    IReadOnlyCollection<CommandDefinitionDto> CommandDefinitions,
    DashboardLayoutDto Layout);

public sealed record GeoPositionDto(decimal Latitude, decimal Longitude, decimal? HeadingDegrees);

public sealed record BatteryStateDto(decimal Percent, bool IsCharging);

public sealed record MachineDto(
    Guid Id,
    string TenantSlug,
    string Name,
    string Model,
    MachineStatus Status,
    GeoPositionDto Position,
    BatteryStateDto Battery,
    string MissionState,
    DateTimeOffset UpdatedAt);

public sealed record TelemetrySampleDto(
    Guid Id,
    string TenantSlug,
    Guid MachineId,
    string StreamKey,
    string MetricKey,
    decimal? NumericValue,
    string? TextValue,
    GeoPositionDto? Position,
    DateTimeOffset RecordedAt);

public sealed record TelemetryUpdateDto(string TenantSlug, Guid MachineId, TelemetrySampleDto Sample);

public sealed record MachineStatusUpdateDto(
    string TenantSlug,
    Guid MachineId,
    MachineStatus Status,
    GeoPositionDto Position,
    BatteryStateDto Battery,
    string MissionState,
    DateTimeOffset UpdatedAt);

public sealed record CommandExecutionDto(
    Guid Id,
    string TenantSlug,
    Guid MachineId,
    string CommandKey,
    string PayloadJson,
    string RequestedBy,
    DateTimeOffset RequestedAt,
    DateTimeOffset? CompletedAt,
    CommandStatus Status,
    string? FailureReason);

public sealed record CommandStatusUpdateDto(string TenantSlug, Guid MachineId, Guid CommandExecutionId, CommandStatus Status, string? FailureReason);

public sealed record OperationalEventDto(
    Guid Id,
    string TenantSlug,
    Guid? MachineId,
    string Type,
    string Message,
    DateTimeOffset OccurredAt);

public sealed record AlertDto(
    Guid Id,
    string TenantSlug,
    Guid? MachineId,
    AlertSeverity Severity,
    string Title,
    string Message,
    DateTimeOffset RaisedAt,
    bool IsResolved,
    DateTimeOffset? ResolvedAt);

public sealed record SimulationStatusDto(string TenantSlug, bool IsRunning);
