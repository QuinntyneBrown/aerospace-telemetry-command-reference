using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Ninja.Infrastructure.Persistence;

namespace Ninja.Infrastructure.Tests;

public sealed class SeedDataTests
{
    [Fact]
    public async Task SeedAsync_creates_three_tenants_with_dashboard_configuration()
    {
        await using var dbContext = CreateDbContext();
        await dbContext.Database.EnsureCreatedAsync();

        await SeedData.SeedAsync(dbContext);

        dbContext.Tenants.Select(tenant => tenant.Slug.Value).Should().BeEquivalentTo(
            SeedData.WhiteLabelSlug,
            SeedData.HarborLiftSlug,
            SeedData.TerraGridSlug);
        dbContext.Machines.Should().HaveCount(6);
        dbContext.CommandDefinitions.Should().HaveCountGreaterThan(10);
        dbContext.TelemetryStreams.Should().HaveCountGreaterThan(10);
        dbContext.DashboardLayouts.Should().HaveCount(3);
        dbContext.NavigationItems.Should().HaveCountGreaterThan(6);
    }

    private static ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }
}
