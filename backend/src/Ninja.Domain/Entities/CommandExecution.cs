using Ninja.Domain.Common;
using Ninja.Domain.Enums;
using Ninja.Domain.Events;
using Ninja.Domain.ValueObjects;

namespace Ninja.Domain.Entities;

public sealed class CommandExecution : Entity
{
    private CommandExecution()
    {
        CommandKey = string.Empty;
        PayloadJson = "{}";
        RequestedBy = string.Empty;
    }

    private CommandExecution(
        CommandExecutionId id,
        TenantId tenantId,
        MachineId machineId,
        string commandKey,
        string payloadJson,
        string requestedBy,
        DateTimeOffset requestedAt)
    {
        Id = id;
        TenantId = tenantId;
        MachineId = machineId;
        CommandKey = commandKey.Trim();
        PayloadJson = string.IsNullOrWhiteSpace(payloadJson) ? "{}" : payloadJson.Trim();
        RequestedBy = requestedBy.Trim();
        RequestedAt = requestedAt;
        Status = CommandStatus.Requested;

        AddDomainEvent(new CommandRequested(TenantId, MachineId, Id, CommandKey, RequestedAt));
    }

    public CommandExecutionId Id { get; private set; }

    public TenantId TenantId { get; private set; }

    public MachineId MachineId { get; private set; }

    public string CommandKey { get; private set; }

    public string PayloadJson { get; private set; }

    public string RequestedBy { get; private set; }

    public DateTimeOffset RequestedAt { get; private set; }

    public DateTimeOffset? CompletedAt { get; private set; }

    public CommandStatus Status { get; private set; }

    public string? FailureReason { get; private set; }

    public static CommandExecution Request(
        CommandExecutionId id,
        TenantId tenantId,
        MachineId machineId,
        string commandKey,
        string payloadJson,
        string requestedBy,
        DateTimeOffset requestedAt)
    {
        if (string.IsNullOrWhiteSpace(commandKey))
        {
            throw new ArgumentException("Command key is required.", nameof(commandKey));
        }

        if (string.IsNullOrWhiteSpace(requestedBy))
        {
            throw new ArgumentException("Requested by is required.", nameof(requestedBy));
        }

        return new CommandExecution(id, tenantId, machineId, commandKey, payloadJson, requestedBy, requestedAt);
    }

    public void Accept(DateTimeOffset acceptedAt)
    {
        EnsureStatus(CommandStatus.Requested);

        Status = CommandStatus.Accepted;
        AddDomainEvent(new CommandAccepted(TenantId, MachineId, Id, acceptedAt));
    }

    public void Reject(string reason, DateTimeOffset rejectedAt)
    {
        EnsureStatus(CommandStatus.Requested);

        Status = CommandStatus.Rejected;
        CompletedAt = rejectedAt;
        FailureReason = RequiredReason(reason);
        AddDomainEvent(new CommandRejected(TenantId, MachineId, Id, FailureReason, rejectedAt));
    }

    public void Complete(DateTimeOffset completedAt)
    {
        EnsureStatus(CommandStatus.Accepted);

        Status = CommandStatus.Completed;
        CompletedAt = completedAt;
        AddDomainEvent(new CommandCompleted(TenantId, MachineId, Id, completedAt));
    }

    public void Fail(string reason, DateTimeOffset failedAt)
    {
        if (Status is not (CommandStatus.Requested or CommandStatus.Accepted))
        {
            throw new InvalidOperationException($"Cannot fail command while it is {Status}.");
        }

        Status = CommandStatus.Failed;
        CompletedAt = failedAt;
        FailureReason = RequiredReason(reason);
        AddDomainEvent(new CommandFailed(TenantId, MachineId, Id, FailureReason, failedAt));
    }

    private void EnsureStatus(CommandStatus expected)
    {
        if (Status != expected)
        {
            throw new InvalidOperationException($"Expected command status {expected}, but found {Status}.");
        }
    }

    private static string RequiredReason(string reason)
    {
        if (string.IsNullOrWhiteSpace(reason))
        {
            throw new ArgumentException("A reason is required.", nameof(reason));
        }

        return reason.Trim();
    }
}
