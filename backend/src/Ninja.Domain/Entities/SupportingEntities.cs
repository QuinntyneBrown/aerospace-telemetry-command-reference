using Ninja.Domain.Common;
using Ninja.Domain.Enums;
using Ninja.Domain.Events;
using Ninja.Domain.ValueObjects;

namespace Ninja.Domain.Entities;

public sealed class TelemetryStream
{
    private TelemetryStream()
    {
        Key = string.Empty;
        DisplayName = string.Empty;
        Unit = string.Empty;
        ValueKind = string.Empty;
    }

    public TelemetryStream(TelemetryStreamId id, TenantId tenantId, string key, string displayName, string unit, string valueKind)
    {
        Id = id;
        TenantId = tenantId;
        Key = Required(key);
        DisplayName = Required(displayName);
        Unit = unit.Trim();
        ValueKind = Required(valueKind);
    }

    public TelemetryStreamId Id { get; private set; }

    public TenantId TenantId { get; private set; }

    public string Key { get; private set; }

    public string DisplayName { get; private set; }

    public string Unit { get; private set; }

    public string ValueKind { get; private set; }

    private static string Required(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Value is required.", nameof(value));
        }

        return value.Trim();
    }
}

public sealed class CommandDefinition
{
    private CommandDefinition()
    {
        Key = string.Empty;
        DisplayName = string.Empty;
        RequiredPermission = string.Empty;
        PayloadSchemaJson = "{}";
    }

    public CommandDefinition(
        Guid id,
        TenantId tenantId,
        string key,
        string displayName,
        string requiredPermission,
        bool isDangerous,
        string payloadSchemaJson)
    {
        Id = id;
        TenantId = tenantId;
        Key = Required(key);
        DisplayName = Required(displayName);
        RequiredPermission = Required(requiredPermission);
        IsDangerous = isDangerous;
        PayloadSchemaJson = string.IsNullOrWhiteSpace(payloadSchemaJson) ? "{}" : payloadSchemaJson.Trim();
    }

    public Guid Id { get; private set; }

    public TenantId TenantId { get; private set; }

    public string Key { get; private set; }

    public string DisplayName { get; private set; }

    public string RequiredPermission { get; private set; }

    public bool IsDangerous { get; private set; }

    public string PayloadSchemaJson { get; private set; }

    private static string Required(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Value is required.", nameof(value));
        }

        return value.Trim();
    }
}

public sealed class OperationalEvent
{
    private OperationalEvent()
    {
        Type = string.Empty;
        Message = string.Empty;
    }

    public OperationalEvent(Guid id, TenantId tenantId, MachineId? machineId, string type, string message, DateTimeOffset occurredAt)
    {
        Id = id;
        TenantId = tenantId;
        MachineId = machineId;
        Type = Required(type);
        Message = Required(message);
        OccurredAt = occurredAt;
    }

    public Guid Id { get; private set; }

    public TenantId TenantId { get; private set; }

    public MachineId? MachineId { get; private set; }

    public string Type { get; private set; }

    public string Message { get; private set; }

    public DateTimeOffset OccurredAt { get; private set; }

    private static string Required(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Value is required.", nameof(value));
        }

        return value.Trim();
    }
}

public sealed class Alert : Entity
{
    private Alert()
    {
        Title = string.Empty;
        Message = string.Empty;
    }

    public Alert(Guid id, TenantId tenantId, MachineId? machineId, AlertSeverity severity, string title, string message, DateTimeOffset raisedAt)
    {
        Id = id;
        TenantId = tenantId;
        MachineId = machineId;
        Severity = severity;
        Title = Required(title);
        Message = Required(message);
        RaisedAt = raisedAt;
        IsResolved = false;

        AddDomainEvent(new AlertRaised(TenantId, Id, Severity, RaisedAt));
    }

    public Guid Id { get; private set; }

    public TenantId TenantId { get; private set; }

    public MachineId? MachineId { get; private set; }

    public AlertSeverity Severity { get; private set; }

    public string Title { get; private set; }

    public string Message { get; private set; }

    public DateTimeOffset RaisedAt { get; private set; }

    public bool IsResolved { get; private set; }

    public DateTimeOffset? ResolvedAt { get; private set; }

    public void Resolve(DateTimeOffset resolvedAt)
    {
        if (IsResolved)
        {
            return;
        }

        IsResolved = true;
        ResolvedAt = resolvedAt;
        AddDomainEvent(new AlertResolved(TenantId, Id, resolvedAt));
    }

    private static string Required(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Value is required.", nameof(value));
        }

        return value.Trim();
    }
}

public sealed class MachineAssignment
{
    private MachineAssignment()
    {
        UserId = string.Empty;
        Role = string.Empty;
    }

    public MachineAssignment(Guid id, TenantId tenantId, MachineId machineId, string userId, string role)
    {
        Id = id;
        TenantId = tenantId;
        MachineId = machineId;
        UserId = Required(userId);
        Role = Required(role);
    }

    public Guid Id { get; private set; }

    public TenantId TenantId { get; private set; }

    public MachineId MachineId { get; private set; }

    public string UserId { get; private set; }

    public string Role { get; private set; }

    private static string Required(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Value is required.", nameof(value));
        }

        return value.Trim();
    }
}

public sealed class NavigationItem
{
    private NavigationItem()
    {
        Label = string.Empty;
        Route = string.Empty;
        Icon = string.Empty;
    }

    public NavigationItem(Guid id, TenantId tenantId, string label, string route, string icon, int sortOrder)
    {
        Id = id;
        TenantId = tenantId;
        Label = Required(label);
        Route = Required(route);
        Icon = Required(icon);
        SortOrder = sortOrder;
    }

    public Guid Id { get; private set; }

    public TenantId TenantId { get; private set; }

    public string Label { get; private set; }

    public string Route { get; private set; }

    public string Icon { get; private set; }

    public int SortOrder { get; private set; }

    private static string Required(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Value is required.", nameof(value));
        }

        return value.Trim();
    }
}

public sealed class FeatureFlag
{
    private FeatureFlag()
    {
        Key = string.Empty;
    }

    public FeatureFlag(Guid id, TenantId tenantId, string key, bool enabled)
    {
        Id = id;
        TenantId = tenantId;
        Key = Required(key);
        Enabled = enabled;
    }

    public Guid Id { get; private set; }

    public TenantId TenantId { get; private set; }

    public string Key { get; private set; }

    public bool Enabled { get; private set; }

    private static string Required(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Value is required.", nameof(value));
        }

        return value.Trim();
    }
}
