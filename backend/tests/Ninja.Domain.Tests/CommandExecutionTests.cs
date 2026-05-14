using FluentAssertions;
using Ninja.Domain.Entities;
using Ninja.Domain.Enums;
using Ninja.Domain.Events;
using Ninja.Domain.ValueObjects;

namespace Ninja.Domain.Tests;

public sealed class CommandExecutionTests
{
    [Fact]
    public void Request_creates_requested_command_and_domain_event()
    {
        var execution = CreateCommand();

        execution.Status.Should().Be(CommandStatus.Requested);
        execution.DomainEvents.Should().ContainSingle()
            .Which.Should().BeOfType<CommandRequested>();
    }

    [Fact]
    public void Accepted_command_can_complete()
    {
        var execution = CreateCommand();

        execution.Accept(DateTimeOffset.UtcNow);
        execution.Complete(DateTimeOffset.UtcNow);

        execution.Status.Should().Be(CommandStatus.Completed);
        execution.CompletedAt.Should().NotBeNull();
        execution.DomainEvents.OfType<CommandAccepted>().Should().ContainSingle();
        execution.DomainEvents.OfType<CommandCompleted>().Should().ContainSingle();
    }

    [Fact]
    public void Requested_command_cannot_complete_before_acceptance()
    {
        var execution = CreateCommand();

        var act = () => execution.Complete(DateTimeOffset.UtcNow);

        act.Should().Throw<InvalidOperationException>()
            .WithMessage("*Expected command status Accepted*");
    }

    [Fact]
    public void Requested_command_can_be_rejected_with_reason()
    {
        var execution = CreateCommand();

        execution.Reject("Denied by gateway", DateTimeOffset.UtcNow);

        execution.Status.Should().Be(CommandStatus.Rejected);
        execution.FailureReason.Should().Be("Denied by gateway");
        execution.DomainEvents.OfType<CommandRejected>().Should().ContainSingle();
    }

    private static CommandExecution CreateCommand()
    {
        return CommandExecution.Request(
            CommandExecutionId.New(),
            TenantId.New(),
            MachineId.New(),
            "pause",
            "{}",
            "operator",
            DateTimeOffset.UtcNow);
    }
}
