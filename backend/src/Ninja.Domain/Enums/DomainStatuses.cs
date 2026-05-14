namespace Ninja.Domain.Enums;

public enum MachineStatus
{
    Offline = 0,
    Online = 1,
    Busy = 2,
    Warning = 3,
    Faulted = 4
}

public enum CommandStatus
{
    Requested = 0,
    Accepted = 1,
    Rejected = 2,
    Completed = 3,
    Failed = 4,
    Cancelled = 5
}

public enum AlertSeverity
{
    Info = 0,
    Warning = 1,
    Critical = 2
}
