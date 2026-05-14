using Ninja.Application.Common.Models;
using Ninja.Domain.Entities;

namespace Ninja.Application.Common.Abstractions;

public interface IApplicationDbContext
{
    IQueryable<Tenant> Tenants { get; }

    IQueryable<Machine> Machines { get; }

    IQueryable<TelemetryStream> TelemetryStreams { get; }

    IQueryable<TelemetrySample> TelemetrySamples { get; }

    IQueryable<CommandDefinition> CommandDefinitions { get; }

    IQueryable<CommandExecution> CommandExecutions { get; }

    IQueryable<DashboardLayout> DashboardLayouts { get; }

    IQueryable<OperationalEvent> OperationalEvents { get; }

    IQueryable<Alert> Alerts { get; }

    IQueryable<MachineAssignment> MachineAssignments { get; }

    IQueryable<NavigationItem> NavigationItems { get; }

    IQueryable<FeatureFlag> FeatureFlags { get; }

    Task AddTelemetrySampleAsync(TelemetrySample sample, CancellationToken cancellationToken);

    Task AddCommandExecutionAsync(CommandExecution execution, CancellationToken cancellationToken);

    Task AddDashboardLayoutAsync(DashboardLayout layout, CancellationToken cancellationToken);

    Task AddOperationalEventAsync(OperationalEvent operationalEvent, CancellationToken cancellationToken);

    Task AddAlertAsync(Alert alert, CancellationToken cancellationToken);

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}

public interface IDateTimeProvider
{
    DateTimeOffset UtcNow { get; }
}

public interface ICurrentUser
{
    bool IsAuthenticated { get; }

    string UserId { get; }

    IReadOnlyCollection<string> TenantSlugs { get; }

    IReadOnlyCollection<string> Permissions { get; }

    IReadOnlyCollection<string> Roles { get; }

    bool CanAccessTenant(string tenantSlug);

    bool HasPermission(string permission);
}

public sealed record CommandDispatchRequest(
    string TenantSlug,
    Guid TenantId,
    Guid MachineId,
    Guid CommandExecutionId,
    string CommandKey,
    string PayloadJson);

public sealed record CommandDispatchResult(bool Accepted, bool Completed, string? RejectionReason, string? FailureReason);

public interface ICommandGateway
{
    Task<CommandDispatchResult> SendAsync(CommandDispatchRequest request, CancellationToken cancellationToken);
}

public interface ITelemetryPublisher
{
    Task PublishTelemetryAsync(TelemetryUpdateDto update, CancellationToken cancellationToken);

    Task PublishMachineStatusAsync(MachineStatusUpdateDto update, CancellationToken cancellationToken);
}

public interface IOperationalEventPublisher
{
    Task PublishOperationalEventAsync(OperationalEventDto update, CancellationToken cancellationToken);
}

public interface ICommandStatusPublisher
{
    Task PublishCommandStatusAsync(CommandStatusUpdateDto update, CancellationToken cancellationToken);
}

public interface IAlertPublisher
{
    Task PublishAlertAsync(AlertDto update, CancellationToken cancellationToken);
}

public interface ITelemetrySimulator
{
    Task StartAsync(string tenantSlug, CancellationToken cancellationToken);

    Task StopAsync(string tenantSlug, CancellationToken cancellationToken);

    bool IsRunning(string tenantSlug);
}
