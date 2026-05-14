namespace Ninja.Domain.Common;

public interface IDomainEvent
{
    DateTimeOffset OccurredAt { get; }
}
