using Ninja.Domain.Common;
using Ninja.Domain.ValueObjects;

namespace Ninja.Domain.Entities;

public sealed class Tenant : Entity
{
    private Tenant()
    {
        Slug = TenantSlug.Create("placeholder");
        DisplayName = string.Empty;
        Brand = new BrandMetadata(string.Empty, "#000000", "#ffffff", string.Empty, string.Empty);
    }

    public Tenant(TenantId id, TenantSlug slug, string displayName, BrandMetadata brand)
    {
        if (string.IsNullOrWhiteSpace(displayName))
        {
            throw new ArgumentException("Display name is required.", nameof(displayName));
        }

        Id = id;
        Slug = slug;
        DisplayName = displayName.Trim();
        Brand = brand;
    }

    public TenantId Id { get; private set; }

    public TenantSlug Slug { get; private set; }

    public string DisplayName { get; private set; }

    public BrandMetadata Brand { get; private set; }
}
