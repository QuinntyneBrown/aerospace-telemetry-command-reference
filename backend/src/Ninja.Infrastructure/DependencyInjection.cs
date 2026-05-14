using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ninja.Application.Common.Abstractions;
using Ninja.Infrastructure.Persistence;
using Ninja.Infrastructure.Services;

namespace Ninja.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration, string environmentName)
    {
        var configuredInMemory = bool.TryParse(configuration["UseInMemoryDatabase"], out var useConfiguredInMemory)
            && useConfiguredInMemory;
        var useInMemory = string.Equals(environmentName, "Testing", StringComparison.OrdinalIgnoreCase)
            || configuredInMemory;

        var inMemoryDatabaseName = $"ninja-reference-{Guid.NewGuid()}";

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            if (useInMemory)
            {
                options.UseInMemoryDatabase(inMemoryDatabaseName);
                return;
            }

            var connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? "Data Source=ninja-reference.db";

            options.UseSqlite(connectionString);
        });

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
        services.AddSingleton<IDateTimeProvider, SystemDateTimeProvider>();
        services.AddScoped<ICommandGateway, DemoCommandGateway>();
        services.AddScoped<DatabaseHealthCheck>();
        services.AddSingleton<DemoTelemetrySimulator>();
        services.AddSingleton<ITelemetrySimulator>(provider => provider.GetRequiredService<DemoTelemetrySimulator>());
        services.AddHostedService(provider => provider.GetRequiredService<DemoTelemetrySimulator>());

        return services;
    }

    public static async Task InitialiseDatabaseAsync(this IServiceProvider serviceProvider, CancellationToken cancellationToken = default)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        if (dbContext.Database.IsRelational())
        {
            await dbContext.Database.MigrateAsync(cancellationToken);
        }
        else
        {
            await dbContext.Database.EnsureCreatedAsync(cancellationToken);
        }

        await SeedData.SeedAsync(dbContext, cancellationToken);
    }
}
