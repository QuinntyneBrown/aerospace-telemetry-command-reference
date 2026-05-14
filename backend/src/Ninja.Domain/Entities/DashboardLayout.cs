using Ninja.Domain.Common;
using Ninja.Domain.ValueObjects;

namespace Ninja.Domain.Entities;

public sealed class DashboardLayout : Entity
{
    private DashboardLayout()
    {
        LayoutJson = "{}";
        UpdatedBy = string.Empty;
    }

    public DashboardLayout(
        DashboardLayoutId id,
        TenantId tenantId,
        string layoutJson,
        string updatedBy,
        DateTimeOffset updatedAt)
    {
        Id = id;
        TenantId = tenantId;
        LayoutJson = NormalizeJson(layoutJson);
        UpdatedBy = updatedBy.Trim();
        UpdatedAt = updatedAt;
    }

    public DashboardLayoutId Id { get; private set; }

    public TenantId TenantId { get; private set; }

    public string LayoutJson { get; private set; }

    public string UpdatedBy { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public void Update(string layoutJson, string updatedBy, DateTimeOffset updatedAt)
    {
        LayoutJson = NormalizeJson(layoutJson);
        UpdatedBy = updatedBy.Trim();
        UpdatedAt = updatedAt;
    }

    private static string NormalizeJson(string layoutJson)
    {
        return string.IsNullOrWhiteSpace(layoutJson) ? "{}" : layoutJson.Trim();
    }
}
