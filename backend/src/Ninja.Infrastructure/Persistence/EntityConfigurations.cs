using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Ninja.Domain.Entities;
using Ninja.Domain.ValueObjects;

namespace Ninja.Infrastructure.Persistence;

internal static class DomainConverters
{
    public static readonly ValueConverter<TenantId, Guid> TenantId = new(id => id.Value, value => new TenantId(value));

    public static readonly ValueConverter<MachineId, Guid> MachineId = new(id => id.Value, value => new MachineId(value));

    public static readonly ValueConverter<CommandExecutionId, Guid> CommandExecutionId = new(id => id.Value, value => new CommandExecutionId(value));

    public static readonly ValueConverter<TelemetryStreamId, Guid> TelemetryStreamId = new(id => id.Value, value => new TelemetryStreamId(value));

    public static readonly ValueConverter<DashboardLayoutId, Guid> DashboardLayoutId = new(id => id.Value, value => new DashboardLayoutId(value));

    public static readonly ValueConverter<TenantSlug, string> TenantSlug = new(slug => slug.Value, value => new TenantSlug(value));
}

internal sealed class TenantConfiguration : IEntityTypeConfiguration<Tenant>
{
    public void Configure(EntityTypeBuilder<Tenant> builder)
    {
        builder.HasKey(tenant => tenant.Id);
        builder.Property(tenant => tenant.Id).HasConversion(DomainConverters.TenantId);
        builder.Property(tenant => tenant.Slug).HasConversion(DomainConverters.TenantSlug).HasMaxLength(80);
        builder.HasIndex(tenant => tenant.Slug).IsUnique();
        builder.Property(tenant => tenant.DisplayName).HasMaxLength(160);
        builder.OwnsOne(tenant => tenant.Brand, owned =>
        {
            owned.Property(brand => brand.DisplayName).HasMaxLength(160);
            owned.Property(brand => brand.PrimaryColor).HasMaxLength(32);
            owned.Property(brand => brand.AccentColor).HasMaxLength(32);
            owned.Property(brand => brand.LogoText).HasMaxLength(80);
            owned.Property(brand => brand.Terminology).HasMaxLength(80);
        });
        builder.Ignore(tenant => tenant.DomainEvents);
    }
}

internal sealed class MachineConfiguration : IEntityTypeConfiguration<Machine>
{
    public void Configure(EntityTypeBuilder<Machine> builder)
    {
        builder.HasKey(machine => machine.Id);
        builder.Property(machine => machine.Id).HasConversion(DomainConverters.MachineId);
        builder.Property(machine => machine.TenantId).HasConversion(DomainConverters.TenantId);
        builder.HasIndex(machine => new { machine.TenantId, machine.Name });
        builder.Property(machine => machine.Name).HasMaxLength(160);
        builder.Property(machine => machine.Model).HasMaxLength(120);
        builder.Property(machine => machine.MissionState).HasMaxLength(160);
        builder.OwnsOne(machine => machine.Position, owned =>
        {
            owned.Property(position => position.Latitude).HasColumnName("Latitude").HasPrecision(9, 6);
            owned.Property(position => position.Longitude).HasColumnName("Longitude").HasPrecision(9, 6);
            owned.Property(position => position.HeadingDegrees).HasColumnName("HeadingDegrees").HasPrecision(6, 2);
        });
        builder.OwnsOne(machine => machine.Battery, owned =>
        {
            owned.Property(battery => battery.Percent).HasColumnName("BatteryPercent").HasPrecision(5, 2);
            owned.Property(battery => battery.IsCharging).HasColumnName("IsCharging");
        });
        builder.Ignore(machine => machine.DomainEvents);
    }
}

internal sealed class TelemetryStreamConfiguration : IEntityTypeConfiguration<TelemetryStream>
{
    public void Configure(EntityTypeBuilder<TelemetryStream> builder)
    {
        builder.HasKey(stream => stream.Id);
        builder.Property(stream => stream.Id).HasConversion(DomainConverters.TelemetryStreamId);
        builder.Property(stream => stream.TenantId).HasConversion(DomainConverters.TenantId);
        builder.HasIndex(stream => new { stream.TenantId, stream.Key }).IsUnique();
        builder.Property(stream => stream.Key).HasMaxLength(120);
        builder.Property(stream => stream.DisplayName).HasMaxLength(160);
        builder.Property(stream => stream.Unit).HasMaxLength(40);
        builder.Property(stream => stream.ValueKind).HasMaxLength(40);
    }
}

internal sealed class TelemetrySampleConfiguration : IEntityTypeConfiguration<TelemetrySample>
{
    public void Configure(EntityTypeBuilder<TelemetrySample> builder)
    {
        builder.HasKey(sample => sample.Id);
        builder.Property(sample => sample.TenantId).HasConversion(DomainConverters.TenantId);
        builder.Property(sample => sample.MachineId).HasConversion(DomainConverters.MachineId);
        builder.HasIndex(sample => new { sample.TenantId, sample.MachineId, sample.RecordedAt });
        builder.Property(sample => sample.StreamKey).HasMaxLength(120);
        builder.Property(sample => sample.MetricKey).HasMaxLength(120);
        builder.Property(sample => sample.NumericValue).HasPrecision(18, 4);
        builder.Property(sample => sample.TextValue).HasMaxLength(400);
        builder.OwnsOne(sample => sample.Position, owned =>
        {
            owned.Property(position => position.Latitude).HasColumnName("PositionLatitude").HasPrecision(9, 6);
            owned.Property(position => position.Longitude).HasColumnName("PositionLongitude").HasPrecision(9, 6);
            owned.Property(position => position.HeadingDegrees).HasColumnName("PositionHeadingDegrees").HasPrecision(6, 2);
        });
        builder.Ignore(sample => sample.DomainEvents);
    }
}

internal sealed class CommandDefinitionConfiguration : IEntityTypeConfiguration<CommandDefinition>
{
    public void Configure(EntityTypeBuilder<CommandDefinition> builder)
    {
        builder.HasKey(command => command.Id);
        builder.Property(command => command.TenantId).HasConversion(DomainConverters.TenantId);
        builder.HasIndex(command => new { command.TenantId, command.Key }).IsUnique();
        builder.Property(command => command.Key).HasMaxLength(120);
        builder.Property(command => command.DisplayName).HasMaxLength(160);
        builder.Property(command => command.RequiredPermission).HasMaxLength(160);
    }
}

internal sealed class CommandExecutionConfiguration : IEntityTypeConfiguration<CommandExecution>
{
    public void Configure(EntityTypeBuilder<CommandExecution> builder)
    {
        builder.HasKey(command => command.Id);
        builder.Property(command => command.Id).HasConversion(DomainConverters.CommandExecutionId);
        builder.Property(command => command.TenantId).HasConversion(DomainConverters.TenantId);
        builder.Property(command => command.MachineId).HasConversion(DomainConverters.MachineId);
        builder.HasIndex(command => new { command.TenantId, command.RequestedAt });
        builder.Property(command => command.CommandKey).HasMaxLength(120);
        builder.Property(command => command.RequestedBy).HasMaxLength(160);
        builder.Property(command => command.FailureReason).HasMaxLength(400);
        builder.Ignore(command => command.DomainEvents);
    }
}

internal sealed class DashboardLayoutConfiguration : IEntityTypeConfiguration<DashboardLayout>
{
    public void Configure(EntityTypeBuilder<DashboardLayout> builder)
    {
        builder.HasKey(layout => layout.Id);
        builder.Property(layout => layout.Id).HasConversion(DomainConverters.DashboardLayoutId);
        builder.Property(layout => layout.TenantId).HasConversion(DomainConverters.TenantId);
        builder.HasIndex(layout => layout.TenantId).IsUnique();
        builder.Property(layout => layout.UpdatedBy).HasMaxLength(160);
    }
}

internal sealed class OperationalEventConfiguration : IEntityTypeConfiguration<OperationalEvent>
{
    public void Configure(EntityTypeBuilder<OperationalEvent> builder)
    {
        builder.HasKey(operationalEvent => operationalEvent.Id);
        builder.Property(operationalEvent => operationalEvent.TenantId).HasConversion(DomainConverters.TenantId);
        builder.Property(operationalEvent => operationalEvent.MachineId).HasConversion(DomainConverters.MachineId);
        builder.HasIndex(operationalEvent => new { operationalEvent.TenantId, operationalEvent.OccurredAt });
        builder.Property(operationalEvent => operationalEvent.Type).HasMaxLength(120);
        builder.Property(operationalEvent => operationalEvent.Message).HasMaxLength(400);
    }
}

internal sealed class AlertConfiguration : IEntityTypeConfiguration<Alert>
{
    public void Configure(EntityTypeBuilder<Alert> builder)
    {
        builder.HasKey(alert => alert.Id);
        builder.Property(alert => alert.TenantId).HasConversion(DomainConverters.TenantId);
        builder.Property(alert => alert.MachineId).HasConversion(DomainConverters.MachineId);
        builder.HasIndex(alert => new { alert.TenantId, alert.IsResolved, alert.RaisedAt });
        builder.Property(alert => alert.Title).HasMaxLength(160);
        builder.Property(alert => alert.Message).HasMaxLength(400);
        builder.Ignore(alert => alert.DomainEvents);
    }
}

internal sealed class MachineAssignmentConfiguration : IEntityTypeConfiguration<MachineAssignment>
{
    public void Configure(EntityTypeBuilder<MachineAssignment> builder)
    {
        builder.HasKey(assignment => assignment.Id);
        builder.Property(assignment => assignment.TenantId).HasConversion(DomainConverters.TenantId);
        builder.Property(assignment => assignment.MachineId).HasConversion(DomainConverters.MachineId);
        builder.HasIndex(assignment => new { assignment.TenantId, assignment.MachineId, assignment.UserId });
        builder.Property(assignment => assignment.UserId).HasMaxLength(160);
        builder.Property(assignment => assignment.Role).HasMaxLength(80);
    }
}

internal sealed class NavigationItemConfiguration : IEntityTypeConfiguration<NavigationItem>
{
    public void Configure(EntityTypeBuilder<NavigationItem> builder)
    {
        builder.HasKey(item => item.Id);
        builder.Property(item => item.TenantId).HasConversion(DomainConverters.TenantId);
        builder.HasIndex(item => new { item.TenantId, item.SortOrder });
        builder.Property(item => item.Label).HasMaxLength(120);
        builder.Property(item => item.Route).HasMaxLength(200);
        builder.Property(item => item.Icon).HasMaxLength(80);
    }
}

internal sealed class FeatureFlagConfiguration : IEntityTypeConfiguration<FeatureFlag>
{
    public void Configure(EntityTypeBuilder<FeatureFlag> builder)
    {
        builder.HasKey(flag => flag.Id);
        builder.Property(flag => flag.TenantId).HasConversion(DomainConverters.TenantId);
        builder.HasIndex(flag => new { flag.TenantId, flag.Key }).IsUnique();
        builder.Property(flag => flag.Key).HasMaxLength(120);
    }
}
