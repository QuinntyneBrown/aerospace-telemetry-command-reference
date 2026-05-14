using Microsoft.AspNetCore.SignalR;
using Ninja.Application.Common.Abstractions;
using Ninja.Application.Common.Models;

namespace Ninja.Api.Realtime;

public sealed class SignalRTelemetryPublisher(IHubContext<TelemetryHub, ITelemetryClient> hubContext) : ITelemetryPublisher
{
    public Task PublishTelemetryAsync(TelemetryUpdateDto update, CancellationToken cancellationToken)
    {
        return Task.WhenAll(
            hubContext.Clients.Group(SignalRGroups.Tenant(update.TenantSlug)).TelemetryReceived(update),
            hubContext.Clients.Group(SignalRGroups.Machine(update.TenantSlug, update.MachineId)).TelemetryReceived(update));
    }

    public Task PublishMachineStatusAsync(MachineStatusUpdateDto update, CancellationToken cancellationToken)
    {
        return Task.WhenAll(
            hubContext.Clients.Group(SignalRGroups.Tenant(update.TenantSlug)).MachineStatusChanged(update),
            hubContext.Clients.Group(SignalRGroups.Machine(update.TenantSlug, update.MachineId)).MachineStatusChanged(update));
    }
}

public sealed class SignalROperationalEventPublisher(IHubContext<OperationsHub, IOperationsClient> hubContext) : IOperationalEventPublisher
{
    public Task PublishOperationalEventAsync(OperationalEventDto update, CancellationToken cancellationToken)
    {
        return hubContext.Clients.Group(SignalRGroups.Tenant(update.TenantSlug)).OperationalEventReceived(update);
    }
}

public sealed class SignalRCommandStatusPublisher(IHubContext<OperationsHub, IOperationsClient> hubContext) : ICommandStatusPublisher
{
    public Task PublishCommandStatusAsync(CommandStatusUpdateDto update, CancellationToken cancellationToken)
    {
        return Task.WhenAll(
            hubContext.Clients.Group(SignalRGroups.Tenant(update.TenantSlug)).CommandStatusChanged(update),
            hubContext.Clients.Group(SignalRGroups.Machine(update.TenantSlug, update.MachineId)).CommandStatusChanged(update));
    }
}

public sealed class SignalRAlertPublisher(IHubContext<OperationsHub, IOperationsClient> hubContext) : IAlertPublisher
{
    public Task PublishAlertAsync(AlertDto update, CancellationToken cancellationToken)
    {
        return hubContext.Clients.Group(SignalRGroups.Tenant(update.TenantSlug)).AlertChanged(update);
    }
}
