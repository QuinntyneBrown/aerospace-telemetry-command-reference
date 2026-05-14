using Microsoft.EntityFrameworkCore;
using Ninja.Application.Common.Abstractions;
using Ninja.Domain.Entities;

namespace Ninja.Infrastructure.Persistence;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options), IApplicationDbContext
{
    public DbSet<Tenant> Tenants => Set<Tenant>();

    public DbSet<Machine> Machines => Set<Machine>();

    public DbSet<TelemetryStream> TelemetryStreams => Set<TelemetryStream>();

    public DbSet<TelemetrySample> TelemetrySamples => Set<TelemetrySample>();

    public DbSet<CommandDefinition> CommandDefinitions => Set<CommandDefinition>();

    public DbSet<CommandExecution> CommandExecutions => Set<CommandExecution>();

    public DbSet<DashboardLayout> DashboardLayouts => Set<DashboardLayout>();

    public DbSet<OperationalEvent> OperationalEvents => Set<OperationalEvent>();

    public DbSet<Alert> Alerts => Set<Alert>();

    public DbSet<MachineAssignment> MachineAssignments => Set<MachineAssignment>();

    public DbSet<NavigationItem> NavigationItems => Set<NavigationItem>();

    public DbSet<FeatureFlag> FeatureFlags => Set<FeatureFlag>();

    IQueryable<Tenant> IApplicationDbContext.Tenants => Tenants;

    IQueryable<Machine> IApplicationDbContext.Machines => Machines;

    IQueryable<TelemetryStream> IApplicationDbContext.TelemetryStreams => TelemetryStreams;

    IQueryable<TelemetrySample> IApplicationDbContext.TelemetrySamples => TelemetrySamples;

    IQueryable<CommandDefinition> IApplicationDbContext.CommandDefinitions => CommandDefinitions;

    IQueryable<CommandExecution> IApplicationDbContext.CommandExecutions => CommandExecutions;

    IQueryable<DashboardLayout> IApplicationDbContext.DashboardLayouts => DashboardLayouts;

    IQueryable<OperationalEvent> IApplicationDbContext.OperationalEvents => OperationalEvents;

    IQueryable<Alert> IApplicationDbContext.Alerts => Alerts;

    IQueryable<MachineAssignment> IApplicationDbContext.MachineAssignments => MachineAssignments;

    IQueryable<NavigationItem> IApplicationDbContext.NavigationItems => NavigationItems;

    IQueryable<FeatureFlag> IApplicationDbContext.FeatureFlags => FeatureFlags;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }

    public async Task AddTelemetrySampleAsync(TelemetrySample sample, CancellationToken cancellationToken)
    {
        await TelemetrySamples.AddAsync(sample, cancellationToken);
    }

    public async Task AddCommandExecutionAsync(CommandExecution execution, CancellationToken cancellationToken)
    {
        await CommandExecutions.AddAsync(execution, cancellationToken);
    }

    public async Task AddDashboardLayoutAsync(DashboardLayout layout, CancellationToken cancellationToken)
    {
        await DashboardLayouts.AddAsync(layout, cancellationToken);
    }

    public async Task AddOperationalEventAsync(OperationalEvent operationalEvent, CancellationToken cancellationToken)
    {
        await OperationalEvents.AddAsync(operationalEvent, cancellationToken);
    }

    public async Task AddAlertAsync(Alert alert, CancellationToken cancellationToken)
    {
        await Alerts.AddAsync(alert, cancellationToken);
    }
}
