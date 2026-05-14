using Microsoft.AspNetCore.Mvc;
using Ninja.Application.Common.Errors;

namespace Ninja.Api.Controllers;

[ApiController]
public abstract class BaseApiController : ControllerBase
{
    protected ActionResult<T> FromResult<T>(Result<T> result)
    {
        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        var statusCode = StatusCodeFor(result.Errors.FirstOrDefault());
        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = result.Errors.FirstOrDefault()?.Code ?? "request.failed",
            Detail = string.Join(" ", result.Errors.Select(error => error.Message))
        };

        problem.Extensions["errors"] = result.Errors
            .Select(error => new { error.Code, error.Message, Type = error.Type.ToString() })
            .ToArray();

        return StatusCode(statusCode, problem);
    }

    private static int StatusCodeFor(ApplicationError? error)
    {
        return error?.Type switch
        {
            ErrorType.Validation => StatusCodes.Status400BadRequest,
            ErrorType.Unauthorized => StatusCodes.Status401Unauthorized,
            ErrorType.Forbidden => StatusCodes.Status403Forbidden,
            ErrorType.NotFound => StatusCodes.Status404NotFound,
            ErrorType.Conflict => StatusCodes.Status409Conflict,
            _ => StatusCodes.Status500InternalServerError
        };
    }
}
