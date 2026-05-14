using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Ninja.Api.Realtime;
using Ninja.Api.Security;
using Ninja.Application;
using Ninja.Application.Common.Abstractions;
using Ninja.Application.Common.Security;
using Ninja.Infrastructure;
using Ninja.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSignalR();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration, builder.Environment.EnvironmentName);

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
var jwtOptions = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() ?? new JwtOptions();
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtOptions.Audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;

                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CanViewTenant", policy => policy.RequireClaim("permission", Permissions.ViewTenant, "*"));
    options.AddPolicy("CanViewTelemetry", policy => policy.RequireClaim("permission", Permissions.ViewTelemetry, "*"));
    options.AddPolicy("CanExecuteCommand", policy => policy.RequireClaim("permission", Permissions.ExecuteCommand, "*"));
    options.AddPolicy("CanManageDashboardLayout", policy => policy.RequireClaim("permission", Permissions.ManageDashboardLayout, "*"));
    options.AddPolicy("CanAcknowledgeAlerts", policy => policy.RequireClaim("permission", Permissions.AcknowledgeAlerts, "*"));
    options.AddPolicy("CanRunSimulation", policy => policy.RequireClaim("permission", Permissions.RunSimulation, "*"));
});

builder.Services.AddScoped<ICurrentUser, HttpCurrentUser>();
builder.Services.AddScoped<ITelemetryPublisher, SignalRTelemetryPublisher>();
builder.Services.AddScoped<IOperationalEventPublisher, SignalROperationalEventPublisher>();
builder.Services.AddScoped<ICommandStatusPublisher, SignalRCommandStatusPublisher>();
builder.Services.AddScoped<IAlertPublisher, SignalRAlertPublisher>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",
                "https://localhost:4200",
                "http://localhost:4201",
                "https://localhost:4201",
                "http://localhost:4202",
                "https://localhost:4202")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddHealthChecks()
    .AddCheck<DatabaseHealthCheck>("database");

var app = builder.Build();

await app.Services.InitialiseDatabaseAsync();

if (app.Environment.IsDevelopment() || app.Environment.EnvironmentName == "Testing")
{
    app.MapOpenApi();
}

app.UseExceptionHandler();
app.UseCors("FrontendDev");
app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("/health");
app.MapControllers();
app.MapHub<TelemetryHub>("/hubs/telemetry");
app.MapHub<OperationsHub>("/hubs/operations");

app.Run();

public partial class Program;
