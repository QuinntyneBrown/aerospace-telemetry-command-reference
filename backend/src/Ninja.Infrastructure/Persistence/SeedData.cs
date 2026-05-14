using Microsoft.EntityFrameworkCore;
using Ninja.Application.Common.Security;
using Ninja.Domain.Entities;
using Ninja.Domain.Enums;
using Ninja.Domain.ValueObjects;

namespace Ninja.Infrastructure.Persistence;

public static class SeedData
{
    public const string WhiteLabelSlug = "white-label";
    public const string HarborLiftSlug = "harborlift";
    public const string TerraGridSlug = "terragrid";

    private static readonly TenantId WhiteLabelTenantId = new(Guid.Parse("10000000-0000-0000-0000-000000000001"));
    private static readonly TenantId HarborLiftTenantId = new(Guid.Parse("10000000-0000-0000-0000-000000000002"));
    private static readonly TenantId TerraGridTenantId = new(Guid.Parse("10000000-0000-0000-0000-000000000003"));

    public static async Task SeedAsync(ApplicationDbContext dbContext, CancellationToken cancellationToken = default)
    {
        if (await dbContext.Tenants.AnyAsync(cancellationToken))
        {
            return;
        }

        var now = DateTimeOffset.UtcNow;

        var tenants = new[]
        {
            new Tenant(
                WhiteLabelTenantId,
                TenantSlug.Create(WhiteLabelSlug),
                "White-Label Operations Console",
                new BrandMetadata("White-Label Operations", "#2563eb", "#14b8a6", "WL", "machine")),
            new Tenant(
                HarborLiftTenantId,
                TenantSlug.Create(HarborLiftSlug),
                "HarborLift Robotics",
                new BrandMetadata("HarborLift Robotics", "#0f766e", "#f59e0b", "HL", "AMR")),
            new Tenant(
                TerraGridTenantId,
                TenantSlug.Create(TerraGridSlug),
                "TerraGrid Autonomy",
                new BrandMetadata("TerraGrid Autonomy", "#166534", "#38bdf8", "TG", "field robot"))
        };

        await dbContext.Tenants.AddRangeAsync(tenants, cancellationToken);
        await dbContext.Machines.AddRangeAsync(CreateMachines(now), cancellationToken);
        await dbContext.TelemetryStreams.AddRangeAsync(CreateTelemetryStreams(), cancellationToken);
        await dbContext.CommandDefinitions.AddRangeAsync(CreateCommandDefinitions(), cancellationToken);
        await dbContext.NavigationItems.AddRangeAsync(CreateNavigationItems(), cancellationToken);
        await dbContext.FeatureFlags.AddRangeAsync(CreateFeatureFlags(), cancellationToken);
        await dbContext.DashboardLayouts.AddRangeAsync(CreateLayouts(now), cancellationToken);
        await dbContext.Alerts.AddRangeAsync(CreateAlerts(now), cancellationToken);
        await dbContext.OperationalEvents.AddRangeAsync(CreateEvents(now), cancellationToken);
        await dbContext.TelemetrySamples.AddRangeAsync(CreateTelemetrySamples(now), cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static IEnumerable<Machine> CreateMachines(DateTimeOffset now)
    {
        return
        [
            new Machine(new MachineId(Guid.Parse("20000000-0000-0000-0000-000000000001")), WhiteLabelTenantId, "Atlas-01", "General Robotics Unit", MachineStatus.Online, new GeoPosition(43.6532m, -79.3832m, 92), new BatteryState(82, false), "Patrol route", now),
            new Machine(new MachineId(Guid.Parse("20000000-0000-0000-0000-000000000002")), WhiteLabelTenantId, "Atlas-02", "General Robotics Unit", MachineStatus.Warning, new GeoPosition(43.6541m, -79.3860m, 11), new BatteryState(24, false), "Charging requested", now),
            new Machine(new MachineId(Guid.Parse("20000000-0000-0000-0000-000000000101")), HarborLiftTenantId, "DockRunner-7", "HarborLift AMR", MachineStatus.Busy, new GeoPosition(45.5019m, -73.5674m, 180), new BatteryState(68, false), "Container move", now),
            new Machine(new MachineId(Guid.Parse("20000000-0000-0000-0000-000000000102")), HarborLiftTenantId, "CraneMate-3", "HarborLift Yard Tug", MachineStatus.Online, new GeoPosition(45.5024m, -73.5681m, 247), new BatteryState(91, false), "Dock queue", now),
            new Machine(new MachineId(Guid.Parse("20000000-0000-0000-0000-000000000201")), TerraGridTenantId, "FieldScout-12", "TerraGrid Rover", MachineStatus.Online, new GeoPosition(42.9849m, -81.2453m, 63), new BatteryState(76, false), "Inspection pass", now),
            new Machine(new MachineId(Guid.Parse("20000000-0000-0000-0000-000000000202")), TerraGridTenantId, "RowRunner-4", "TerraGrid Implement Carrier", MachineStatus.Busy, new GeoPosition(42.9862m, -81.2470m, 125), new BatteryState(59, false), "Coverage route", now)
        ];
    }

    private static IEnumerable<TelemetryStream> CreateTelemetryStreams()
    {
        return
        [
            Stream(WhiteLabelTenantId, "fleet-health", "Fleet health", "%", "number"),
            Stream(WhiteLabelTenantId, "telemetry-ingest", "Telemetry ingest", "msg/s", "number"),
            Stream(WhiteLabelTenantId, "command-latency", "Command latency", "ms", "number"),
            Stream(WhiteLabelTenantId, "battery-state", "Battery state", "%", "number"),

            Stream(HarborLiftTenantId, "dock-utilization", "Dock utilization", "%", "number"),
            Stream(HarborLiftTenantId, "aisle-congestion", "Aisle congestion", "%", "number"),
            Stream(HarborLiftTenantId, "route-blockage", "Route blockage", "alerts", "number"),
            Stream(HarborLiftTenantId, "charging-queue-depth", "Charging queue depth", "AMRs", "number"),
            Stream(HarborLiftTenantId, "container-move-progress", "Container move progress", "%", "number"),
            Stream(HarborLiftTenantId, "handoff-status", "Handoff status", "", "text"),

            Stream(TerraGridTenantId, "gps-route-progress", "GPS route progress", "%", "number"),
            Stream(TerraGridTenantId, "field-coverage", "Field coverage", "%", "number"),
            Stream(TerraGridTenantId, "weather-conditions", "Weather conditions", "", "text"),
            Stream(TerraGridTenantId, "terrain-state", "Terrain state", "", "text"),
            Stream(TerraGridTenantId, "payload-state", "Payload state", "", "text"),
            Stream(TerraGridTenantId, "hazard-markers", "Hazard markers", "markers", "number")
        ];
    }

    private static IEnumerable<CommandDefinition> CreateCommandDefinitions()
    {
        return
        [
            Command(WhiteLabelTenantId, "pause", "Pause", false),
            Command(WhiteLabelTenantId, "resume", "Resume", false),
            Command(WhiteLabelTenantId, "return-to-base", "Return to base", true),
            Command(WhiteLabelTenantId, "restart-component", "Restart component", true),
            Command(WhiteLabelTenantId, "lock-out", "Lock out", true),

            Command(HarborLiftTenantId, "pause-mission", "Pause mission", false),
            Command(HarborLiftTenantId, "reroute", "Reroute", false),
            Command(HarborLiftTenantId, "return-to-charger", "Return to charger", true),
            Command(HarborLiftTenantId, "set-speed-limit", "Set speed limit", true),
            Command(HarborLiftTenantId, "confirm-handoff", "Confirm handoff", false),

            Command(TerraGridTenantId, "return-to-base", "Return to base", true),
            Command(TerraGridTenantId, "pause-implement", "Pause implement", true),
            Command(TerraGridTenantId, "adjust-route", "Adjust route", false),
            Command(TerraGridTenantId, "reduce-speed", "Reduce speed", false),
            Command(TerraGridTenantId, "mark-hazard", "Mark hazard", false)
        ];
    }

    private static IEnumerable<NavigationItem> CreateNavigationItems()
    {
        return
        [
            Nav(WhiteLabelTenantId, "Overview", "/overview", "layout-dashboard", 0),
            Nav(WhiteLabelTenantId, "Fleet", "/fleet", "bot", 1),
            Nav(WhiteLabelTenantId, "Commands", "/commands", "radio", 2),
            Nav(HarborLiftTenantId, "Yard", "/yard", "container", 0),
            Nav(HarborLiftTenantId, "Fleet", "/fleet", "truck", 1),
            Nav(HarborLiftTenantId, "Handoffs", "/handoffs", "replace", 2),
            Nav(TerraGridTenantId, "Coverage", "/coverage", "map", 0),
            Nav(TerraGridTenantId, "Fleet", "/fleet", "tractor", 1),
            Nav(TerraGridTenantId, "Hazards", "/hazards", "triangle-alert", 2)
        ];
    }

    private static IEnumerable<FeatureFlag> CreateFeatureFlags()
    {
        return
        [
            Flag(WhiteLabelTenantId, "fleet-map", true),
            Flag(WhiteLabelTenantId, "event-stream", true),
            Flag(HarborLiftTenantId, "dock-queue", true),
            Flag(HarborLiftTenantId, "container-handoff", true),
            Flag(TerraGridTenantId, "weather-panel", true),
            Flag(TerraGridTenantId, "hazard-markers", true)
        ];
    }

    private static IEnumerable<DashboardLayout> CreateLayouts(DateTimeOffset now)
    {
        return
        [
            Layout(WhiteLabelTenantId, "system", now, """{"tiles":["fleet-overview","fleet-health","machine-table","command-center","event-stream"]}"""),
            Layout(HarborLiftTenantId, "system", now, """{"tiles":["yard-status","dock-queue","container-progress","charging-queue","command-center"]}"""),
            Layout(TerraGridTenantId, "system", now, """{"tiles":["field-coverage","route-progress","weather-terrain","hazard-markers","command-center"]}""")
        ];
    }

    private static IEnumerable<Alert> CreateAlerts(DateTimeOffset now)
    {
        return
        [
            new Alert(Guid.Parse("60000000-0000-0000-0000-000000000001"), WhiteLabelTenantId, new MachineId(Guid.Parse("20000000-0000-0000-0000-000000000002")), AlertSeverity.Warning, "Low battery", "Atlas-02 is below the preferred battery threshold.", now.AddMinutes(-12)),
            new Alert(Guid.Parse("60000000-0000-0000-0000-000000000101"), HarborLiftTenantId, new MachineId(Guid.Parse("20000000-0000-0000-0000-000000000101")), AlertSeverity.Critical, "Blocked aisle", "DockRunner-7 reports a blocked path near zone C.", now.AddMinutes(-8)),
            new Alert(Guid.Parse("60000000-0000-0000-0000-000000000201"), TerraGridTenantId, new MachineId(Guid.Parse("20000000-0000-0000-0000-000000000202")), AlertSeverity.Warning, "Soft terrain", "RowRunner-4 detected soft terrain along the next segment.", now.AddMinutes(-18))
        ];
    }

    private static IEnumerable<OperationalEvent> CreateEvents(DateTimeOffset now)
    {
        return
        [
            new OperationalEvent(Guid.NewGuid(), WhiteLabelTenantId, null, "tenant.ready", "White-label tenant seeded.", now.AddMinutes(-30)),
            new OperationalEvent(Guid.NewGuid(), HarborLiftTenantId, null, "tenant.ready", "HarborLift tenant seeded.", now.AddMinutes(-30)),
            new OperationalEvent(Guid.NewGuid(), TerraGridTenantId, null, "tenant.ready", "TerraGrid tenant seeded.", now.AddMinutes(-30))
        ];
    }

    private static IEnumerable<TelemetrySample> CreateTelemetrySamples(DateTimeOffset now)
    {
        return
        [
            Sample(WhiteLabelTenantId, Guid.Parse("20000000-0000-0000-0000-000000000001"), "fleet-health", "fleet.health", 94, null, now.AddMinutes(-1)),
            Sample(WhiteLabelTenantId, Guid.Parse("20000000-0000-0000-0000-000000000002"), "telemetry-ingest", "ingest.rate", 510, null, now.AddMinutes(-1)),
            Sample(HarborLiftTenantId, Guid.Parse("20000000-0000-0000-0000-000000000101"), "container-move-progress", "move.progress", 63, null, now.AddMinutes(-1)),
            Sample(HarborLiftTenantId, Guid.Parse("20000000-0000-0000-0000-000000000102"), "dock-utilization", "dock.utilization", 78, null, now.AddMinutes(-1)),
            Sample(TerraGridTenantId, Guid.Parse("20000000-0000-0000-0000-000000000201"), "field-coverage", "coverage.percent", 42, null, now.AddMinutes(-1)),
            Sample(TerraGridTenantId, Guid.Parse("20000000-0000-0000-0000-000000000202"), "gps-route-progress", "route.progress", 57, null, now.AddMinutes(-1))
        ];
    }

    private static TelemetryStream Stream(TenantId tenantId, string key, string displayName, string unit, string valueKind)
    {
        return new TelemetryStream(TelemetryStreamId.New(), tenantId, key, displayName, unit, valueKind);
    }

    private static CommandDefinition Command(TenantId tenantId, string key, string displayName, bool isDangerous)
    {
        return new CommandDefinition(Guid.NewGuid(), tenantId, key, displayName, Permissions.ExecuteCommand, isDangerous, "{}");
    }

    private static NavigationItem Nav(TenantId tenantId, string label, string route, string icon, int sortOrder)
    {
        return new NavigationItem(Guid.NewGuid(), tenantId, label, route, icon, sortOrder);
    }

    private static FeatureFlag Flag(TenantId tenantId, string key, bool enabled)
    {
        return new FeatureFlag(Guid.NewGuid(), tenantId, key, enabled);
    }

    private static DashboardLayout Layout(TenantId tenantId, string updatedBy, DateTimeOffset now, string json)
    {
        return new DashboardLayout(DashboardLayoutId.New(), tenantId, json, updatedBy, now);
    }

    private static TelemetrySample Sample(TenantId tenantId, Guid machineId, string streamKey, string metricKey, decimal? numeric, string? text, DateTimeOffset now)
    {
        return new TelemetrySample(Guid.NewGuid(), tenantId, new MachineId(machineId), streamKey, metricKey, numeric, text, null, now);
    }
}
