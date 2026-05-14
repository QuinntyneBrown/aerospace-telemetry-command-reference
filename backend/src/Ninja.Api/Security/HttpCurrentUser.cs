using System.Security.Claims;
using Ninja.Application.Common.Abstractions;

namespace Ninja.Api.Security;

public sealed class HttpCurrentUser(IHttpContextAccessor httpContextAccessor) : ICurrentUser
{
    private ClaimsPrincipal? User => httpContextAccessor.HttpContext?.User;

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated == true;

    public string UserId =>
        User?.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User?.FindFirstValue("sub")
        ?? "anonymous";

    public IReadOnlyCollection<string> TenantSlugs => Claims("tenant");

    public IReadOnlyCollection<string> Permissions => Claims("permission");

    public IReadOnlyCollection<string> Roles => Claims(ClaimTypes.Role).Concat(Claims("role")).Distinct(StringComparer.OrdinalIgnoreCase).ToArray();

    public bool CanAccessTenant(string tenantSlug)
    {
        return TenantSlugs.Contains("*", StringComparer.OrdinalIgnoreCase)
            || TenantSlugs.Contains(tenantSlug.Trim().ToLowerInvariant(), StringComparer.OrdinalIgnoreCase);
    }

    public bool HasPermission(string permission)
    {
        return Permissions.Contains("*", StringComparer.OrdinalIgnoreCase)
            || Permissions.Contains(permission, StringComparer.OrdinalIgnoreCase);
    }

    private IReadOnlyCollection<string> Claims(string type)
    {
        return User?.FindAll(type).Select(claim => claim.Value).Where(value => !string.IsNullOrWhiteSpace(value)).ToArray()
            ?? [];
    }
}
