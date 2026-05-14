using Ninja.Domain.Common;
using Ninja.Domain.Enums;
using Ninja.Domain.ValueObjects;

namespace Ninja.Domain.Events;

public sealed record MachineStatusChanged(
    TenantId TenantId,
    MachineId MachineId,
    MachineStatus Status,
    DateTimeOffset OccurredAt) : IDomainEvent;

public sealed record TelemetrySampleRecorded(
    TenantId TenantId,
    MachineId MachineId,
    string StreamKey,
    DateTimeOffset OccurredAt) : IDomainEvent;

public sealed record CommandRequested(
    TenantId TenantId,
    MachineId MachineId,
    CommandExecutionId CommandExecutionId,
    string CommandKey,
    DateTimeOffset OccurredAt) : IDomainEvent;

public sealed record CommandAccepted(
    TenantId TenantId,
    MachineId MachineId,
    CommandExecutionId CommandExecutionId,
    DateTimeOffset OccurredAt) : IDomainEvent;

public sealed record CommandRejected(
    TenantId TenantId,
    MachineId MachineId,
    CommandExecutionId CommandExecutionId,
    string Reason,
    DateTimeOffset OccurredAt) : IDomainEvent;

public sealed record CommandCompleted(
    TenantId TenantId,
    MachineId MachineId,
    CommandExecutionId CommandExecutionId,
    DateTimeOffset OccurredAt) : IDomainEvent;

public sealed record CommandFailed(
    TenantId TenantId,
    MachineId MachineId,
    CommandExecutionId CommandExecutionId,
    string Reason,
    DateTimeOffset OccurredAt) : IDomainEvent;

public sealed record AlertRaised(
    TenantId TenantId,
    Guid AlertId,
    AlertSeverity Severity,
    DateTimeOffset OccurredAt) : IDomainEvent;

public sealed record AlertResolved(
    TenantId TenantId,
    Guid AlertId,
    DateTimeOffset OccurredAt) : IDomainEvent;
