using Ninja.Application.Common.Models;

namespace Ninja.Api.Realtime;

public interface ITelemetryClient
{
    Task TelemetryReceived(TelemetryUpdateDto update);

    Task MachineStatusChanged(MachineStatusUpdateDto update);
}

public interface IOperationsClient
{
    Task CommandStatusChanged(CommandStatusUpdateDto update);

    Task OperationalEventReceived(OperationalEventDto update);

    Task AlertChanged(AlertDto update);
}
