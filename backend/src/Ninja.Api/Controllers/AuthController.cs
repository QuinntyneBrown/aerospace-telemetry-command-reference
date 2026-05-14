using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Ninja.Api.Security;
using Ninja.Application.Common.Security;

namespace Ninja.Api.Controllers;

[Route("api/v1/auth")]
public sealed class AuthController(IOptions<JwtOptions> options) : BaseApiController
{
    [HttpPost("demo-token")]
    [AllowAnonymous]
    public ActionResult<DemoTokenResponse> CreateDemoToken(DemoTokenRequest request)
    {
        var jwtOptions = options.Value;
        var userId = string.IsNullOrWhiteSpace(request.UserId) ? "demo-operator" : request.UserId.Trim();
        var tenants = request.TenantSlugs is { Count: > 0 } ? request.TenantSlugs : ["white-label", "harborlift", "terragrid"];
        var permissions = request.Permissions is { Count: > 0 }
            ? request.Permissions
            :
            [
                Permissions.ViewTenant,
                Permissions.ViewTelemetry,
                Permissions.ExecuteCommand,
                Permissions.ManageDashboardLayout,
                Permissions.AcknowledgeAlerts,
                Permissions.RunSimulation
            ];

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userId),
            new(ClaimTypes.NameIdentifier, userId)
        };

        claims.AddRange(tenants.Select(tenant => new Claim("tenant", tenant.Trim().ToLowerInvariant())));
        claims.AddRange(permissions.Select(permission => new Claim("permission", permission)));
        claims.AddRange((request.Roles is { Count: > 0 } ? request.Roles : ["Operator"]).Select(role => new Claim(ClaimTypes.Role, role)));

        var expiresAt = DateTimeOffset.UtcNow.AddHours(jwtOptions.DemoTokenHours);
        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            jwtOptions.Issuer,
            jwtOptions.Audience,
            claims,
            expires: expiresAt.UtcDateTime,
            signingCredentials: signingCredentials);

        return Ok(new DemoTokenResponse(new JwtSecurityTokenHandler().WriteToken(token), expiresAt, tenants, permissions));
    }
}

public sealed record DemoTokenRequest(
    string? UserId,
    IReadOnlyCollection<string>? TenantSlugs,
    IReadOnlyCollection<string>? Permissions,
    IReadOnlyCollection<string>? Roles);

public sealed record DemoTokenResponse(
    string AccessToken,
    DateTimeOffset ExpiresAt,
    IReadOnlyCollection<string> TenantSlugs,
    IReadOnlyCollection<string> Permissions);
