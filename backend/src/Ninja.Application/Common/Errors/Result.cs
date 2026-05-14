namespace Ninja.Application.Common.Errors;

public enum ErrorType
{
    Validation,
    NotFound,
    Conflict,
    Forbidden,
    Unauthorized,
    Unexpected
}

public sealed record ApplicationError(ErrorType Type, string Code, string Message)
{
    public static ApplicationError Validation(string code, string message) => new(ErrorType.Validation, code, message);

    public static ApplicationError NotFound(string code, string message) => new(ErrorType.NotFound, code, message);

    public static ApplicationError Conflict(string code, string message) => new(ErrorType.Conflict, code, message);

    public static ApplicationError Forbidden(string code, string message) => new(ErrorType.Forbidden, code, message);

    public static ApplicationError Unauthorized(string code, string message) => new(ErrorType.Unauthorized, code, message);

    public static ApplicationError Unexpected(string code, string message) => new(ErrorType.Unexpected, code, message);
}

public sealed class Result<T>
{
    private Result(T? value, IReadOnlyList<ApplicationError> errors)
    {
        Value = value;
        Errors = errors;
    }

    public bool IsSuccess => Errors.Count == 0;

    public T? Value { get; }

    public IReadOnlyList<ApplicationError> Errors { get; }

    public static Result<T> Success(T value) => new(value, []);

    public static Result<T> Failure(IEnumerable<ApplicationError> errors) => new(default, errors.ToArray());

    public static Result<T> Failure(ApplicationError error) => new(default, [error]);
}

public sealed record EmptyResult
{
    public static EmptyResult Instance { get; } = new();
}
