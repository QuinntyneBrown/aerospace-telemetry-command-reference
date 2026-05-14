namespace Ninja.Domain.ValueObjects;

public readonly record struct TenantId(Guid Value)
{
    public static TenantId New() => new(Guid.NewGuid());

    public override string ToString() => Value.ToString();
}

public readonly record struct MachineId(Guid Value)
{
    public static MachineId New() => new(Guid.NewGuid());

    public override string ToString() => Value.ToString();
}

public readonly record struct CommandExecutionId(Guid Value)
{
    public static CommandExecutionId New() => new(Guid.NewGuid());

    public override string ToString() => Value.ToString();
}

public readonly record struct TelemetryStreamId(Guid Value)
{
    public static TelemetryStreamId New() => new(Guid.NewGuid());

    public override string ToString() => Value.ToString();
}

public readonly record struct DashboardLayoutId(Guid Value)
{
    public static DashboardLayoutId New() => new(Guid.NewGuid());

    public override string ToString() => Value.ToString();
}

public readonly record struct TenantSlug
{
    public TenantSlug(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Tenant slug is required.", nameof(value));
        }

        Value = value.Trim().ToLowerInvariant();
    }

    public string Value { get; }

    public static TenantSlug Create(string value) => new(value);

    public override string ToString() => Value;
}
