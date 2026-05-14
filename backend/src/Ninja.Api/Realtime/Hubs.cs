using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Ninja.Application.Common.Models;

namespace Ninja.Api.Realtime;

[Authorize]
public sealed class TelemetryHub : Hub<ITelemetryClient>
{
    public async Task SubscribeTenant(string tenantSlug)
    {
        EnsureTenantAccess(tenantSlug);
        await Groups.AddToGroupAsync(Context.ConnectionId, SignalRGroups.Tenant(tenantSlug));
    }

    public async Task SubscribeMachine(string tenantSlug, Guid machineId)
    {
        EnsureTenantAccess(tenantSlug);
        await Groups.AddToGroupAsync(Context.ConnectionId, SignalRGroups.Machine(tenantSlug, machineId));
    }

    private void EnsureTenantAccess(string tenantSlug)
    {
        if (!CanAccessTenant(Context.User, tenantSlug))
        {
            throw new HubException("The user cannot access this tenant.");
        }
    }

    private static bool CanAccessTenant(System.Security.Claims.ClaimsPrincipal? user, string tenantSlug)
    {
        var tenants = user?.FindAll("tenant").Select(claim => claim.Value).ToArray() ?? [];
        return tenants.Contains("*", StringComparer.OrdinalIgnoreCase)
            || tenants.Contains(tenantSlug.Trim().ToLowerInvariant(), StringComparer.OrdinalIgnoreCase);
    }
}

[Authorize]
public sealed class OperationsHub : Hub<IOperationsClient>
{
    public async Task SubscribeTenant(string tenantSlug)
    {
        EnsureTenantAccess(tenantSlug);
        await Groups.AddToGroupAsync(Context.ConnectionId, SignalRGroups.Tenant(tenantSlug));
    }

    public async Task SubscribeMachine(string tenantSlug, Guid machineId)
    {
        EnsureTenantAccess(tenantSlug);
        await Groups.AddToGroupAsync(Context.ConnectionId, SignalRGroups.Machine(tenantSlug, machineId));
    }

    private void EnsureTenantAccess(string tenantSlug)
    {
        if (!CanAccessTenant(Context.User, tenantSlug))
        {
            throw new HubException("The user cannot access this tenant.");
        }
    }

    private static bool CanAccessTenant(System.Security.Claims.ClaimsPrincipal? user, string tenantSlug)
    {
        var tenants = user?.FindAll("tenant").Select(claim => claim.Value).ToArray() ?? [];
        return tenants.Contains("*", StringComparer.OrdinalIgnoreCase)
            || tenants.Contains(tenantSlug.Trim().ToLowerInvariant(), StringComparer.OrdinalIgnoreCase);
    }
}
