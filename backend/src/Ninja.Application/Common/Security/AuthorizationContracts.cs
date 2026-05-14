namespace Ninja.Application.Common.Security;

public static class Permissions
{
    public const string ViewTenant = "tenant:view";
    public const string ViewTelemetry = "telemetry:view";
    public const string ExecuteCommand = "command:execute";
    public const string ManageDashboardLayout = "dashboard-layout:manage";
    public const string AcknowledgeAlerts = "alerts:acknowledge";
    public const string RunSimulation = "simulation:run";
}

public interface IAuthorizeRequest
{
    string TenantSlug { get; }

    string RequiredPermission { get; }
}

public interface ITransactionalRequest;
