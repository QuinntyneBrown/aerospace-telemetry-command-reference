using System.Reflection;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Ninja.Application.Common.Behaviors;

namespace Ninja.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehavior<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(PerformanceBehavior<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehavior<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(TransactionBehavior<,>));

        foreach (var validatorType in Assembly.GetExecutingAssembly().GetTypes()
                     .Where(type => type is { IsAbstract: false, IsInterface: false }))
        {
            var validatorInterfaces = validatorType.GetInterfaces()
                .Where(type => type.IsGenericType && type.GetGenericTypeDefinition() == typeof(IRequestValidator<>));

            foreach (var validatorInterface in validatorInterfaces)
            {
                services.AddTransient(validatorInterface, validatorType);
            }
        }

        return services;
    }
}
