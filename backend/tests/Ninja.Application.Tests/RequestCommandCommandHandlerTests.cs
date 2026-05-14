using FluentAssertions;
using Ninja.Application.Common.Abstractions;
using Ninja.Application.Common.Models;
using Ninja.Application.Common.Security;
using Ninja.Application.Features.Commands;
using Ninja.Domain.Entities;
using Ninja.Domain.Enums;
using Ninja.Domain.ValueObjects;

namespace Ninja.Application.Tests;

public sealed class RequestCommandCommandHandlerTests
{
    [Fact]
    public async Task Handle_records_command_events_and_status_updates()
    {
        var tenantId = TenantId.New();
        var machineId = MachineId.New();
        var dbContext = new FakeApplicationDbContext
        {
            TenantItems =
            [
                new Tenant(
                    tenantId,
                    TenantSlug.Create("white-label"),
                    "White Label",
                    new BrandMetadata("White Label", "#000000", "#ffffff", "WL", "machine"))
            ],
            MachineItems =
            [
                new Machine(
                    machineId,
                    tenantId,
                    "Atlas",
                    "Demo",
                    MachineStatus.Online,
                    new GeoPosition(1, 1),
                    new BatteryState(90, false),
                    "Ready",
                    DateTimeOffset.UtcNow)
            ],
            CommandDefinitionItems =
            [
                new CommandDefinition(Guid.NewGuid(), tenantId, "pause", "Pause", Permissions.ExecuteCommand, false, "{}")
            ]
        };

        var commandPublisher = new RecordingCommandStatusPublisher();
        var eventPublisher = new RecordingOperationalEventPublisher();
        var handler = new RequestCommandCommandHandler(
            dbContext,
            new FakeCurrentUser(),
            new FixedDateTimeProvider(),
            new AcceptingCommandGateway(),
            commandPublisher,
            eventPublisher);

        var result = await handler.Handle(new RequestCommandCommand("white-label", machineId.Value, "pause", "{}"), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Status.Should().Be(CommandStatus.Completed);
        dbContext.CommandExecutionItems.Should().ContainSingle();
        dbContext.OperationalEventItems.Should().HaveCount(3);
        commandPublisher.Updates.Select(update => update.Status).Should().Equal(
            CommandStatus.Requested,
            CommandStatus.Accepted,
            CommandStatus.Completed);
        eventPublisher.Events.Select(update => update.Type).Should().Equal(
            "command.requested",
            "command.accepted",
            "command.completed");
    }

    private sealed class FakeApplicationDbContext : IApplicationDbContext
    {
        public List<Tenant> TenantItems { get; init; } = [];

        public List<Machine> MachineItems { get; init; } = [];

        public List<CommandDefinition> CommandDefinitionItems { get; init; } = [];

        public List<CommandExecution> CommandExecutionItems { get; } = [];

        public List<OperationalEvent> OperationalEventItems { get; } = [];

        public IQueryable<Tenant> Tenants => TenantItems.AsQueryable();

        public IQueryable<Machine> Machines => MachineItems.AsQueryable();

        public IQueryable<TelemetryStream> TelemetryStreams => Array.Empty<TelemetryStream>().AsQueryable();

        public IQueryable<TelemetrySample> TelemetrySamples => Array.Empty<TelemetrySample>().AsQueryable();

        public IQueryable<CommandDefinition> CommandDefinitions => CommandDefinitionItems.AsQueryable();

        public IQueryable<CommandExecution> CommandExecutions => CommandExecutionItems.AsQueryable();

        public IQueryable<DashboardLayout> DashboardLayouts => Array.Empty<DashboardLayout>().AsQueryable();

        public IQueryable<OperationalEvent> OperationalEvents => OperationalEventItems.AsQueryable();

        public IQueryable<Alert> Alerts => Array.Empty<Alert>().AsQueryable();

        public IQueryable<MachineAssignment> MachineAssignments => Array.Empty<MachineAssignment>().AsQueryable();

        public IQueryable<NavigationItem> NavigationItems => Array.Empty<NavigationItem>().AsQueryable();

        public IQueryable<FeatureFlag> FeatureFlags => Array.Empty<FeatureFlag>().AsQueryable();

        public Task AddTelemetrySampleAsync(TelemetrySample sample, CancellationToken cancellationToken) => Task.CompletedTask;

        public Task AddCommandExecutionAsync(CommandExecution execution, CancellationToken cancellationToken)
        {
            CommandExecutionItems.Add(execution);
            return Task.CompletedTask;
        }

        public Task AddDashboardLayoutAsync(DashboardLayout layout, CancellationToken cancellationToken) => Task.CompletedTask;

        public Task AddOperationalEventAsync(OperationalEvent operationalEvent, CancellationToken cancellationToken)
        {
            OperationalEventItems.Add(operationalEvent);
            return Task.CompletedTask;
        }

        public Task AddAlertAsync(Alert alert, CancellationToken cancellationToken) => Task.CompletedTask;

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken) => Task.FromResult(1);
    }

    private sealed class FixedDateTimeProvider : IDateTimeProvider
    {
        public DateTimeOffset UtcNow => new(2026, 5, 14, 12, 0, 0, TimeSpan.Zero);
    }

    private sealed class FakeCurrentUser : ICurrentUser
    {
        public bool IsAuthenticated => true;

        public string UserId => "operator";

        public IReadOnlyCollection<string> TenantSlugs => ["white-label"];

        public IReadOnlyCollection<string> Permissions => [Ninja.Application.Common.Security.Permissions.ExecuteCommand];

        public IReadOnlyCollection<string> Roles => ["Operator"];

        public bool CanAccessTenant(string tenantSlug) => tenantSlug == "white-label";

        public bool HasPermission(string permission) => Permissions.Contains(permission);
    }

    private sealed class AcceptingCommandGateway : ICommandGateway
    {
        public Task<CommandDispatchResult> SendAsync(CommandDispatchRequest request, CancellationToken cancellationToken)
        {
            return Task.FromResult(new CommandDispatchResult(true, true, null, null));
        }
    }

    private sealed class RecordingCommandStatusPublisher : ICommandStatusPublisher
    {
        public List<CommandStatusUpdateDto> Updates { get; } = [];

        public Task PublishCommandStatusAsync(CommandStatusUpdateDto update, CancellationToken cancellationToken)
        {
            Updates.Add(update);
            return Task.CompletedTask;
        }
    }

    private sealed class RecordingOperationalEventPublisher : IOperationalEventPublisher
    {
        public List<OperationalEventDto> Events { get; } = [];

        public Task PublishOperationalEventAsync(OperationalEventDto update, CancellationToken cancellationToken)
        {
            Events.Add(update);
            return Task.CompletedTask;
        }
    }
}
