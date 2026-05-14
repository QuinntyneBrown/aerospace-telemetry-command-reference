using Ninja.Application.Common.Abstractions;

namespace Ninja.Infrastructure.Services;

public sealed class DemoCommandGateway : ICommandGateway
{
    public Task<CommandDispatchResult> SendAsync(CommandDispatchRequest request, CancellationToken cancellationToken)
    {
        if (request.PayloadJson.Contains("\"reject\":true", StringComparison.OrdinalIgnoreCase))
        {
            return Task.FromResult(new CommandDispatchResult(false, false, "Demo gateway rejected the command.", null));
        }

        if (request.PayloadJson.Contains("\"fail\":true", StringComparison.OrdinalIgnoreCase))
        {
            return Task.FromResult(new CommandDispatchResult(true, false, null, "Demo gateway simulated a command failure."));
        }

        return Task.FromResult(new CommandDispatchResult(true, true, null, null));
    }
}
