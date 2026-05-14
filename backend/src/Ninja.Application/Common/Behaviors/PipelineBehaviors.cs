using System.Diagnostics;
using System.Reflection;
using MediatR;
using Microsoft.Extensions.Logging;
using Ninja.Application.Common.Abstractions;
using Ninja.Application.Common.Errors;
using Ninja.Application.Common.Security;

namespace Ninja.Application.Common.Behaviors;

public interface IRequestValidator<in TRequest>
{
    IReadOnlyCollection<ApplicationError> Validate(TRequest request);
}

public sealed class ValidationBehavior<TRequest, TResponse>(
    IEnumerable<IRequestValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var errors = validators
            .SelectMany(validator => validator.Validate(request))
            .ToArray();

        if (errors.Length > 0)
        {
            return ResultFactory.CreateFailure<TResponse>(errors);
        }

        return await next();
    }
}

public sealed class AuthorizationBehavior<TRequest, TResponse>(ICurrentUser currentUser)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (request is not IAuthorizeRequest authorizedRequest)
        {
            return await next();
        }

        if (!currentUser.IsAuthenticated)
        {
            return ResultFactory.CreateFailure<TResponse>(
                [ApplicationError.Unauthorized("auth.required", "Authentication is required.")]);
        }

        if (!currentUser.CanAccessTenant(authorizedRequest.TenantSlug))
        {
            return ResultFactory.CreateFailure<TResponse>(
                [ApplicationError.Forbidden("tenant.forbidden", "The user cannot access this tenant.")]);
        }

        if (!currentUser.HasPermission(authorizedRequest.RequiredPermission))
        {
            return ResultFactory.CreateFailure<TResponse>(
                [ApplicationError.Forbidden("permission.forbidden", "The user does not have the required permission.")]);
        }

        return await next();
    }
}

public sealed class LoggingBehavior<TRequest, TResponse>(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        logger.LogDebug("Handling request {RequestName}", typeof(TRequest).Name);
        var response = await next();
        logger.LogDebug("Handled request {RequestName}", typeof(TRequest).Name);
        return response;
    }
}

public sealed class PerformanceBehavior<TRequest, TResponse>(ILogger<PerformanceBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var stopwatch = Stopwatch.StartNew();
        var response = await next();
        stopwatch.Stop();

        if (stopwatch.ElapsedMilliseconds > 500)
        {
            logger.LogWarning("Request {RequestName} took {ElapsedMilliseconds} ms", typeof(TRequest).Name, stopwatch.ElapsedMilliseconds);
        }

        return response;
    }
}

public sealed class UnhandledExceptionBehavior<TRequest, TResponse>(ILogger<UnhandledExceptionBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        try
        {
            return await next();
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Unhandled exception for request {RequestName}", typeof(TRequest).Name);
            return ResultFactory.CreateFailure<TResponse>(
                [ApplicationError.Unexpected("request.unhandled", "An unexpected error occurred.")]);
        }
    }
}

public sealed class TransactionBehavior<TRequest, TResponse>(IApplicationDbContext dbContext)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var response = await next();

        if (request is ITransactionalRequest && ResultFactory.IsSuccess(response))
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return response;
    }
}

internal static class ResultFactory
{
    public static TResponse CreateFailure<TResponse>(IReadOnlyCollection<ApplicationError> errors)
    {
        var responseType = typeof(TResponse);

        if (!responseType.IsGenericType || responseType.GetGenericTypeDefinition() != typeof(Result<>))
        {
            throw new InvalidOperationException($"{responseType.Name} must be Result<T> to use pipeline failures.");
        }

        var method = responseType.GetMethod(
            nameof(Result<object>.Failure),
            BindingFlags.Public | BindingFlags.Static,
            [typeof(IEnumerable<ApplicationError>)]);

        return (TResponse)method!.Invoke(null, [errors])!;
    }

    public static bool IsSuccess<TResponse>(TResponse response)
    {
        if (response is null)
        {
            return false;
        }

        var property = typeof(TResponse).GetProperty(nameof(Result<object>.IsSuccess));
        return property is not null && property.GetValue(response) is true;
    }
}
