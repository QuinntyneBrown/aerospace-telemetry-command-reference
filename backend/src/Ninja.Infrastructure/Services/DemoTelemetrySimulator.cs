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

            var metric = SelectMetric(tenantSlug);
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
            await telemetryPublisher.PublishMachineStatusAsync(new MachineStatusUpdateDto(tenant.Slug.Value, machine.Id.Value, machine.Status, machine.UpdatedAt), cancellationToken);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static (string StreamKey, string MetricKey, decimal? NumericValue, string? TextValue) SelectMetric(string tenantSlug)
    {
        return tenantSlug switch
        {
            SeedData.HarborLiftSlug => ("container-move-progress", "move.progress", Random.Shared.Next(35, 99), null),
            SeedData.TerraGridSlug => ("field-coverage", "coverage.percent", Random.Shared.Next(20, 95), null),
            _ => ("fleet-health", "fleet.health", Random.Shared.Next(70, 99), null)
        };
    }

    private static string Normalize(string tenantSlug) => tenantSlug.Trim().ToLowerInvariant();
}
