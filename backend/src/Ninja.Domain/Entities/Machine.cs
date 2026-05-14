using Ninja.Domain.Common;
using Ninja.Domain.Enums;
using Ninja.Domain.Events;
using Ninja.Domain.ValueObjects;

namespace Ninja.Domain.Entities;

public sealed class Machine : Entity
{
    private Machine()
    {
        Name = string.Empty;
        Model = string.Empty;
        MissionState = string.Empty;
        Battery = new BatteryState(0, false);
        Position = new GeoPosition(0, 0);
    }

    public Machine(
        MachineId id,
        TenantId tenantId,
        string name,
        string model,
        MachineStatus status,
        GeoPosition position,
        BatteryState battery,
        string missionState,
        DateTimeOffset updatedAt)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Machine name is required.", nameof(name));
        }

        Id = id;
        TenantId = tenantId;
        Name = name.Trim();
        Model = model.Trim();
        Status = status;
        Position = position.Normalize();
        Battery = battery.Clamp();
        MissionState = missionState.Trim();
        UpdatedAt = updatedAt;
    }

    public MachineId Id { get; private set; }

    public TenantId TenantId { get; private set; }

    public string Name { get; private set; }

    public string Model { get; private set; }

    public MachineStatus Status { get; private set; }

    public GeoPosition Position { get; private set; }

    public BatteryState Battery { get; private set; }

    public string MissionState { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public void UpdateTelemetry(
        MachineStatus status,
        GeoPosition position,
        BatteryState battery,
        string missionState,
        DateTimeOffset updatedAt)
    {
        var statusChanged = Status != status;

        Status = status;
        Position = position.Normalize();
        Battery = battery.Clamp();
        MissionState = missionState.Trim();
        UpdatedAt = updatedAt;

        if (statusChanged)
        {
            AddDomainEvent(new MachineStatusChanged(TenantId, Id, Status, updatedAt));
        }
    }
}
