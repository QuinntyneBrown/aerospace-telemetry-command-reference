namespace Ninja.Application.Common.Models;

public static class SignalRGroups
{
    public static string Tenant(string tenantSlug) => $"tenant:{tenantSlug.Trim().ToLowerInvariant()}";

    public static string Machine(string tenantSlug, Guid machineId) => $"{Tenant(tenantSlug)}:machine:{machineId}";
}
