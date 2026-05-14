using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Ninja.Application.Common.Abstractions;
using Ninja.Application.Common.Models;
using Ninja.Domain.Entities;
using Ninja.Domain.Enums;
using Ninja.Domain.ValueObjects;
using Ninja.Infrastructure.Persistence;

namespace Ninja.Infrastructure.Services;

public sealed class DemoTelemetrySimulator(
    IServiceScopeFactory scopeFactory,
    ILogger<DemoTelemetrySimulator> logger)
    : BackgroundService, ITelemetrySimulator
{
    private readonly ConcurrentDictionary<string, byte> _runningTenants = new(StringComparer.OrdinalIgnoreCase);

    public Task StartAsync(string tenantSlug, CancellationToken cancellationToken)
    {
        _runningTenants.TryAdd(Normalize(tenantSlug), 0);
        return Task.CompletedTask;
    }

    public Task StopAsync(string tenantSlug, CancellationToken cancellationToken)
    {
        _runningTenants.TryRemove(Normalize(tenantSlug), out _);
        return Task.CompletedTask;
    }

    public bool IsRunning(string tenantSlug) => _runningTenants.ContainsKey(Normalize(tenantSlug));

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            foreach (var tenantSlug in _runningTenants.Keys)
            {
                try
                {
                    await GenerateTenantTelemetryAsync(tenantSlug, stoppingToken);
                }
                catch (Exception exception)
                {
                    logger.LogError(exception, "Telemetry simulation failed for tenant {TenantSlug}", tenantSlug);
                }
            }

            await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
        }
    }

    private async Task GenerateTenantTelemetryAsync(string tenantSlug, CancellationToken cancellationToken)
    {
        using var scope = scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var clock = scope.ServiceProvider.GetRequiredService<IDateTimeProvider>();
        var telemetryPublisher = scope.ServiceProvider.GetRequiredService<ITelemetryPublisher>();

        var slug = TenantSlug.Create(tenantSlug);
        var tenant = await dbContext.Tenants.FirstOrDefaultAsync(candidate => candidate.Slug == slug, cancellationToken);
        if (tenant is null)
        {
            _runningTenants.TryRemove(tenantSlug, out _);
            return;
        }

        var machines = await dbContext.Machines
            .Where(machine => machine.TenantId == tenant.Id)
            .ToListAsync(cancellationToken);

        foreach (var machine in machines)
        {
            var now = clock.UtcNow;
            var nextBattery = new BatteryState(machine.Battery.Percent + Random.Shared.Next(-2, 2), machine.Battery.IsCharging).Clamp();
            var status = nextBattery.Percent < 20 ? MachineStatus.Warning : Random.Shared.Next(0, 4) == 0 ? MachineStatus.Busy : MachineStatus.Online;
            var position = new GeoPosition(
                machine.Position.Latitude + Random.Shared.Next(-5, 6) / 10000m,
                machine.Position.Longitude + Random.Shared.Next(-5, 6) / 10000m,
                (machine.Position.HeadingDegrees ?? 0) + Random.Shared.Next(-8, 9));

            machine.UpdateTelemetry(status, position, nextBattery, machine.MissionState, now);

            foreach (var metric in SelectMetrics(tenantSlug, machine))
            {
                var sample = new TelemetrySample(
                    Guid.NewGuid(),
                    tenant.Id,
                    machine.Id,
                    metric.StreamKey,
                    metric.MetricKey,
                    metric.NumericValue,
                    metric.TextValue,
                    position,
                    now);

                await dbContext.TelemetrySamples.AddAsync(sample, cancellationToken);

                var sampleDto = sample.ToDto(tenant.Slug.Value);
                await telemetryPublisher.PublishTelemetryAsync(new TelemetryUpdateDto(tenant.Slug.Value, machine.Id.Value, sampleDto), cancellationToken);
            }

            await telemetryPublisher.PublishMachineStatusAsync(
                new MachineStatusUpdateDto(
                    tenant.Slug.Value,
                    machine.Id.Value,
                    machine.Status,
                    new GeoPositionDto(position.Latitude, position.Longitude, position.HeadingDegrees),
                    new BatteryStateDto(machine.Battery.Percent, machine.Battery.IsCharging),
                    machine.MissionState,
                    machine.UpdatedAt),
                cancellationToken);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static IReadOnlyCollection<SimulatedMetric> SelectMetrics(string tenantSlug, Machine machine)
    {
        return tenantSlug switch
        {
            SeedData.HarborLiftSlug =>
            [
                Number("container-move-progress", "move.progress", Random.Shared.Next(35, 99)),
                Number("container-throughput", "move.throughput", Random.Shared.Next(22, 58)),
                Number("dock-utilization", "dock.utilization", Random.Shared.Next(55, 96)),
                Number("aisle-congestion", "aisle.congestion", Random.Shared.Next(8, 58)),
                Number("charging-queue-depth", "charging.queue.depth", Random.Shared.Next(0, 8)),
                Number("charging-wait-minutes", "charging.wait.minutes", Random.Shared.Next(3, 22)),
                Number("route-blockage", "route.blockage.count", Random.Shared.Next(0, 5)),
                Text("handoff-status", "handoff.status", Random.Shared.Next(0, 3) switch
                {
                    0 => "ready",
                    1 => "staged",
                    _ => "blocked"
                })
            ],
            SeedData.TerraGridSlug =>
            [
                Number("gps-route-progress", "route.progress", Random.Shared.Next(20, 96)),
                Number("field-coverage", "coverage.percent", Random.Shared.Next(20, 96)),
                Number("inspection-progress", "inspection.progress", Random.Shared.Next(20, 100)),
                Number("battery-state", "battery.percent", machine.Battery.Percent),
                Number("drive-temperature", "drive.temperature", Random.Shared.Next(31, 48)),
                Number("wind-speed", "weather.wind", Random.Shared.Next(7, 28)),
                Number("payloads-ready", "payloads.ready", Random.Shared.Next(2, 8)),
                Number("hazard-markers", "hazard.marker.count", Random.Shared.Next(0, 8)),
                Text("terrain-state", "terrain.state", Random.Shared.Next(0, 3) switch
                {
                    0 => "firm",
                    1 => "soft",
                    _ => "washout"
                }),
                Text("payload-state", "payload.state", Random.Shared.Next(0, 3) switch
                {
                    0 => "ready",
                    1 => "sampling",
                    _ => "calibrating"
                }),
                Text("weather-conditions", "weather.conditions", Random.Shared.Next(0, 3) switch
                {
                    0 => "clear",
                    1 => "wind watch",
                    _ => "light rain"
                })
            ],
            _ =>
            [
                Number("fleet-health", "fleet.health", Random.Shared.Next(70, 99)),
                Number("telemetry-ingest", "ingest.rate", Random.Shared.Next(420, 640)),
                Number("command-latency", "command.latency.p95", Random.Shared.Next(120, 240)),
                Number("battery-state", "battery.percent", machine.Battery.Percent)
            ]
        };
    }

    private static SimulatedMetric Number(string streamKey, string metricKey, decimal value)
    {
        return new SimulatedMetric(streamKey, metricKey, value, null);
    }

    private static SimulatedMetric Text(string streamKey, string metricKey, string value)
    {
        return new SimulatedMetric(streamKey, metricKey, null, value);
    }

    private static string Normalize(string tenantSlug) => tenantSlug.Trim().ToLowerInvariant();

    private sealed record SimulatedMetric(string StreamKey, string MetricKey, decimal? NumericValue, string? TextValue);
}
