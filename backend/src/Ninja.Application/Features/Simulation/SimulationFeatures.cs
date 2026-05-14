using MediatR;
using Ninja.Application.Common.Abstractions;
using Ninja.Application.Common.Errors;
using Ninja.Application.Common.Models;
using Ninja.Application.Common.Security;

namespace Ninja.Application.Features.Simulation;

public sealed record StartSimulationCommand(string TenantSlug)
    : IRequest<Result<SimulationStatusDto>>, IAuthorizeRequest
{
    public string RequiredPermission => Permissions.RunSimulation;
}

public sealed class StartSimulationCommandHandler(ITelemetrySimulator telemetrySimulator)
    : IRequestHandler<StartSimulationCommand, Result<SimulationStatusDto>>
{
    public async Task<Result<SimulationStatusDto>> Handle(StartSimulationCommand request, CancellationToken cancellationToken)
    {
        await telemetrySimulator.StartAsync(request.TenantSlug, cancellationToken);
        return Result<SimulationStatusDto>.Success(new SimulationStatusDto(request.TenantSlug, true));
    }
}

public sealed record StopSimulationCommand(string TenantSlug)
    : IRequest<Result<SimulationStatusDto>>, IAuthorizeRequest
{
    public string RequiredPermission => Permissions.RunSimulation;
}

public sealed class StopSimulationCommandHandler(ITelemetrySimulator telemetrySimulator)
    : IRequestHandler<StopSimulationCommand, Result<SimulationStatusDto>>
{
    public async Task<Result<SimulationStatusDto>> Handle(StopSimulationCommand request, CancellationToken cancellationToken)
    {
        await telemetrySimulator.StopAsync(request.TenantSlug, cancellationToken);
        return Result<SimulationStatusDto>.Success(new SimulationStatusDto(request.TenantSlug, false));
    }
}
