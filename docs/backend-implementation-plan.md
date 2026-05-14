# Backend Implementation Plan

## Goal

Build the backend as a .NET reference implementation for the white-label robotics telemetry and command dashboard.

The finished backend should demonstrate:

- ASP.NET Core Web API controllers for tenant configuration, fleet state, telemetry, commands, events, and demo simulation.
- SignalR hubs for live telemetry, fleet status, command status, and operational event updates.
- Clean Architecture boundaries that keep domain and application logic independent from ASP.NET Core, persistence, SignalR, and external adapters.
- Clean Code practices: small handlers, explicit models, focused services, clear dependency direction, predictable naming, and tests around behavior.
- MediatR for in-process commands, queries, notifications, and pipeline behaviors, using the free no-license-key baseline.
- A demo-ready implementation that can support the neutral white-label app, HarborLift Robotics, and TerraGrid Autonomy without backend forks.

## Technology Decisions

- Runtime: .NET 10 LTS.
- API host: ASP.NET Core Web API.
- HTTP API style: controllers, not Minimal APIs.
- Real-time transport: ASP.NET Core SignalR.
- Application orchestration: MediatR.
- MediatR package baseline: pin `MediatR` to `12.5.0`.
- Persistence: EF Core through infrastructure abstractions.
- Local demo database: SQLite or in-memory provider during early implementation.
- Production-shaped database option: PostgreSQL or SQL Server behind the same infrastructure contracts.
- Validation: FluentValidation or focused custom validators in the Application layer.
- API errors: RFC 7807 `ProblemDetails`.
- Authentication baseline: JWT bearer authentication with role and tenant claims.
- Authorization baseline: policy-based authorization for tenant access and command execution.
- Tests: xUnit, FluentAssertions, and ASP.NET Core integration tests.

### MediatR Package Rule

Use `MediatR` version `12.5.0` for the free no-license-key implementation baseline.

Current NuGet metadata shows `12.5.0` as an Apache-2.0 package, while the latest `14.1.0` package documents license-key configuration. Do not upgrade MediatR past `12.5.0` unless the repository records an explicit licensing decision.

Rules:

- Put the MediatR version in `Directory.Packages.props`.
- Do not use floating package versions.
- Do not suppress license warnings as a substitute for a licensing decision.
- Do not add `MediatR.Extensions.Microsoft.DependencyInjection`; MediatR 12 supports `IServiceCollection` registration directly.
- Use MediatR inside the backend only. Do not leak MediatR request types into frontend contracts.

## Project Shape

Create a .NET solution under `backend`.

```text
backend/
  Ninja.ReferenceArchitecture.sln
  Directory.Packages.props
  Directory.Build.props

  src/
    Ninja.Api/
    Ninja.Application/
    Ninja.Domain/
    Ninja.Infrastructure/

  tests/
    Ninja.Domain.Tests/
    Ninja.Application.Tests/
    Ninja.Infrastructure.Tests/
    Ninja.Api.Tests/
```

### Project Responsibilities

`Ninja.Domain`

- Enterprise and domain behavior.
- Entities, value objects, enums, domain events, and domain services.
- No references to ASP.NET Core, EF Core, SignalR, MediatR, or infrastructure packages.

`Ninja.Application`

- Use cases expressed as commands, queries, handlers, notifications, and application services.
- DTOs returned to the API and SignalR publishers.
- Interfaces for persistence, clocks, current user, command gateway, telemetry publisher, and event publisher.
- Validation, authorization checks, pipeline behaviors, and transaction orchestration.
- References `Ninja.Domain` and MediatR.

`Ninja.Infrastructure`

- EF Core DbContext, entity configurations, migrations, seed data, and persistence implementations.
- Demo telemetry simulator and command gateway adapters.
- Outbound integrations and vendor-specific adapters.
- SignalR publisher implementations that use `IHubContext`.
- References `Ninja.Application` and `Ninja.Domain`.

`Ninja.Api`

- ASP.NET Core composition root.
- Controllers.
- SignalR hubs.
- Authentication and authorization setup.
- Swagger/OpenAPI setup.
- Health checks, CORS, middleware, and endpoint mapping.
- References `Ninja.Application` and `Ninja.Infrastructure`.

## Dependency Direction

Keep dependencies one way.

```text
Ninja.Api
  -> Ninja.Application
  -> Ninja.Domain

Ninja.Api
  -> Ninja.Infrastructure
  -> Ninja.Application
  -> Ninja.Domain
```

Allowed:

- API controllers call `ISender.Send(...)`.
- API hubs call application services only for connection and subscription workflows.
- Application handlers depend on interfaces declared in Application.
- Infrastructure implements Application interfaces.
- Infrastructure maps Domain entities to storage models through EF Core configuration.

Not allowed:

- Domain references Application, Infrastructure, API, EF Core, SignalR, or MediatR.
- Application references Infrastructure, API, SignalR, EF Core migrations, or ASP.NET Core controllers.
- Controllers inject DbContext directly.
- Hubs contain business rules.
- Infrastructure publishes frontend-specific DTOs directly without going through application contracts.

## Domain Model

Start with a compact model that supports the reference dashboard without overbuilding.

Core aggregate roots:

- `Tenant`
- `Machine`
- `CommandExecution`
- `DashboardLayout`

Supporting entities:

- `TelemetrySample`
- `TelemetryStream`
- `CommandDefinition`
- `OperationalEvent`
- `Alert`
- `MachineAssignment`

Value objects:

- `TenantId`
- `MachineId`
- `CommandExecutionId`
- `TelemetryStreamId`
- `DashboardLayoutId`
- `GeoPosition`
- `BatteryState`
- `TemperatureReading`
- `MachineStatus`
- `CommandStatus`
- `AlertSeverity`
- `TenantSlug`

Domain events:

- `MachineStatusChanged`
- `TelemetrySampleRecorded`
- `CommandRequested`
- `CommandAccepted`
- `CommandRejected`
- `CommandCompleted`
- `CommandFailed`
- `AlertRaised`
- `AlertResolved`

Rules:

- Tenant ownership is required for machines, telemetry, commands, layouts, alerts, and events.
- Commands must be selected from the tenant's registered command definitions.
- Commands must transition through explicit states.
- Telemetry samples must be immutable after recording.
- Domain events describe facts that already happened.
- Domain methods should enforce invariants before state changes.

## Application Layer

Use feature folders so commands, queries, handlers, validators, and DTOs stay close together.

```text
src/Ninja.Application/
  Common/
    Abstractions/
    Behaviors/
    Errors/
    Models/
    Security/

  Features/
    Tenants/
    DashboardConfiguration/
    Machines/
    Telemetry/
    Commands/
    Events/
    Alerts/
    Simulation/
```

Example feature shape:

```text
Features/Commands/RequestCommand/
  RequestCommand.cs
  RequestCommandHandler.cs
  RequestCommandValidator.cs
  RequestCommandResult.cs
```

MediatR usage:

- Queries implement `IRequest<TResponse>`.
- Commands implement `IRequest<TResponse>`.
- Domain/application notifications implement `INotification`.
- Controllers depend on `ISender`.
- Notification publishers depend on `IPublisher`.
- Handlers stay small and delegate durable behavior to domain objects or focused application services.

Pipeline behaviors:

- `ValidationBehavior<TRequest, TResponse>`
- `AuthorizationBehavior<TRequest, TResponse>`
- `LoggingBehavior<TRequest, TResponse>`
- `PerformanceBehavior<TRequest, TResponse>`
- `UnhandledExceptionBehavior<TRequest, TResponse>`
- `TransactionBehavior<TRequest, TResponse>` for commands that mutate persistence.

Application abstractions:

- `IApplicationDbContext`
- `ICurrentUser`
- `ITenantContext`
- `IDateTimeProvider`
- `ICommandGateway`
- `ITelemetryPublisher`
- `IOperationalEventPublisher`
- `ICommandStatusPublisher`
- `ITelemetrySimulator`

Rules:

- Business logic belongs in domain methods or application handlers, not controllers.
- Handlers should return result DTOs, not EF entities.
- Application interfaces should describe required behavior, not implementation technology.
- Use cancellation tokens on every async method.
- Keep tenant checks explicit in every query and command.

## API Layer

Expose controllers for request/response workflows. Controllers should be thin and predictable.

Controllers:

- `TenantsController`
- `DashboardConfigurationController`
- `MachinesController`
- `TelemetryController`
- `CommandsController`
- `EventsController`
- `AlertsController`
- `SimulationController`

Controller rules:

- Use route versioning from the start, such as `/api/v1/...`.
- Use constructor injection for `ISender` only unless a controller has a clear host-level need.
- Convert MediatR results to `ActionResult<T>`.
- Return `ProblemDetails` for validation, authorization, not found, conflict, and command rejection errors.
- Use explicit request and response DTOs.
- Do not return domain entities directly.

Suggested HTTP endpoints:

```text
GET    /api/v1/tenants
GET    /api/v1/tenants/{tenantSlug}

GET    /api/v1/dashboard-configuration/{tenantSlug}
GET    /api/v1/dashboard-layouts/{tenantSlug}
PUT    /api/v1/dashboard-layouts/{tenantSlug}

GET    /api/v1/tenants/{tenantSlug}/machines
GET    /api/v1/tenants/{tenantSlug}/machines/{machineId}
GET    /api/v1/tenants/{tenantSlug}/machines/{machineId}/telemetry/latest
GET    /api/v1/tenants/{tenantSlug}/machines/{machineId}/telemetry/history

GET    /api/v1/tenants/{tenantSlug}/commands/definitions
POST   /api/v1/tenants/{tenantSlug}/machines/{machineId}/commands
GET    /api/v1/tenants/{tenantSlug}/commands/{commandExecutionId}
GET    /api/v1/tenants/{tenantSlug}/commands/history

GET    /api/v1/tenants/{tenantSlug}/events
GET    /api/v1/tenants/{tenantSlug}/alerts
POST   /api/v1/tenants/{tenantSlug}/alerts/{alertId}/resolve

POST   /api/v1/simulation/{tenantSlug}/start
POST   /api/v1/simulation/{tenantSlug}/stop
```

## SignalR Layer

Use SignalR for live state, not as a replacement for the HTTP API.

Hubs:

- `TelemetryHub` at `/hubs/telemetry`
- `OperationsHub` at `/hubs/operations`

`TelemetryHub` responsibilities:

- Subscribe connections to tenant and machine telemetry groups.
- Unsubscribe connections from groups.
- Stream live telemetry updates to authorized clients.

`OperationsHub` responsibilities:

- Stream command status updates.
- Stream operational events.
- Stream machine status and alert updates.

Strongly typed client contracts:

```csharp
public interface ITelemetryClient
{
    Task TelemetryReceived(TelemetryUpdateDto update);
    Task MachineStatusChanged(MachineStatusUpdateDto update);
}

public interface IOperationsClient
{
    Task CommandStatusChanged(CommandStatusUpdateDto update);
    Task OperationalEventReceived(OperationalEventDto update);
    Task AlertChanged(AlertDto update);
}
```

SignalR rules:

- Hubs are thin connection endpoints.
- Hubs do not store durable state.
- Hubs do not perform command execution.
- Use `IHubContext<THub, TClient>` from infrastructure publishers and notification handlers.
- Group names must include tenant context, such as `tenant:{tenantId}` and `tenant:{tenantId}:machine:{machineId}`.
- Authorize group subscriptions before adding a connection.
- Treat SignalR messages as projections of application events.

## Infrastructure Layer

Infrastructure provides concrete implementations for Application abstractions.

Persistence:

- `ApplicationDbContext`
- EF Core entity configurations per aggregate.
- Migrations owned by Infrastructure.
- Seed data for the neutral tenant, HarborLift Robotics, and TerraGrid Autonomy.
- Read-model queries optimized for dashboard screens.

Command gateway:

- Start with `DemoCommandGateway`.
- Simulate accepted, rejected, completed, and failed command outcomes.
- Keep a future adapter boundary for real robot/vendor command APIs.

Telemetry:

- Start with `DemoTelemetrySimulator` as a hosted service.
- Generate plausible machine status, location, battery, mission, alert, and tenant-specific telemetry samples.
- Persist recent samples needed for history views.
- Publish live updates through application publisher abstractions.

Event publishing:

- Map domain/application events into SignalR DTOs.
- Publish tenant-scoped and machine-scoped messages.
- Persist operational events before publishing live notifications.

Rules:

- Infrastructure implementations should be replaceable without changing handlers.
- Demo services should be clearly named and configurable.
- Vendor-specific code should live behind interfaces and never leak into Domain.

## Tenant and Brand Model

The backend should support the same three dashboard variants as the frontend:

- White-label operations console.
- HarborLift Robotics.
- TerraGrid Autonomy.

Tenant configuration should include:

- Tenant identity and display name.
- Branding metadata used by the frontend.
- Enabled telemetry streams.
- Enabled command definitions.
- Navigation and dashboard layout data.
- Feature flags for domain-specific panels.
- Role-to-command authorization rules.

Rules:

- The backend must not fork controllers or hubs per tenant.
- Tenant-specific differences belong in seed data, configuration records, command definitions, telemetry definitions, and adapter implementations.
- Shared application use cases should work for every tenant.

## Security Plan

Authentication:

- Use JWT bearer authentication.
- Include user id, tenant ids, roles, and permissions as claims.
- Use simple demo token issuance only if a full identity provider is out of scope.

Authorization:

- `CanViewTenant`
- `CanViewTelemetry`
- `CanExecuteCommand`
- `CanManageDashboardLayout`
- `CanAcknowledgeAlerts`
- `CanRunSimulation`

Command safety:

- Validate command definitions against tenant and machine.
- Check command authorization before creating `CommandExecution`.
- Require idempotency keys for command requests once real devices are involved.
- Audit every command request and terminal command status.
- Never execute a command directly from a SignalR hub.

## Phase 1: Backend Solution Scaffold

Projects: all backend projects

Deliverables:

- `Ninja.ReferenceArchitecture.sln`.
- Four source projects.
- Four test projects.
- Central package management through `Directory.Packages.props`.
- `MediatR` pinned to `12.5.0`.
- Nullable reference types enabled.
- Treat warnings consistently.
- Basic build pipeline command documented.

Verification:

```bash
dotnet restore backend/Ninja.ReferenceArchitecture.sln
dotnet build backend/Ninja.ReferenceArchitecture.sln
dotnet test backend/Ninja.ReferenceArchitecture.sln
```

## Phase 2: Domain Foundation

Project: `Ninja.Domain`

Deliverables:

- Tenant, machine, telemetry, command, alert, event, and dashboard layout domain models.
- Value objects and enums for IDs, status, severity, location, and telemetry state.
- Domain event abstractions.
- Command state transition rules.
- Tenant ownership rules.

Verification:

- Unit tests for command state transitions.
- Unit tests for tenant/machine invariants.
- Unit tests for telemetry sample immutability.
- `dotnet test backend/tests/Ninja.Domain.Tests`

## Phase 3: Application Contracts and MediatR

Project: `Ninja.Application`

Deliverables:

- Application abstractions.
- Feature folder conventions.
- Initial commands and queries for tenants, machines, dashboard configuration, telemetry, and command requests.
- MediatR registration extension.
- Pipeline behaviors for validation, logging, exceptions, authorization, performance, and transactions.
- Result/error model for mapping application failures to API responses.

Verification:

- Handler tests with fake application abstractions.
- Pipeline behavior tests.
- Compile-time check that Application does not reference Infrastructure or API.

## Phase 4: Persistence and Seed Data

Project: `Ninja.Infrastructure`

Deliverables:

- EF Core DbContext.
- Entity configurations.
- Initial migration.
- Seed data for:
  - Neutral white-label tenant.
  - HarborLift Robotics tenant.
  - TerraGrid Autonomy tenant.
- Machine, telemetry stream, command definition, layout, alert, and event seed records.
- Persistence implementation for `IApplicationDbContext`.

Verification:

- Migration can apply to a clean local database.
- Seed data creates all three tenants.
- Integration tests verify basic read/write behavior.

## Phase 5: HTTP Controllers

Project: `Ninja.Api`

Deliverables:

- Controller routes under `/api/v1`.
- OpenAPI/Swagger setup.
- `ProblemDetails` error mapping.
- CORS policy for the Angular development hosts.
- Controller actions for tenants, dashboard configuration, machines, telemetry, commands, events, alerts, and simulation.

Verification:

- API integration tests for success and failure paths.
- Swagger document includes all planned endpoints.
- Controllers do not inject DbContext or infrastructure services directly.

## Phase 6: SignalR Hubs and Publishers

Projects: `Ninja.Api`, `Ninja.Application`, `Ninja.Infrastructure`

Deliverables:

- `TelemetryHub`.
- `OperationsHub`.
- Strongly typed SignalR client interfaces.
- Application publisher abstractions.
- Infrastructure publishers using `IHubContext`.
- Tenant and machine group naming helpers.
- Authorization checks for hub subscription methods.

Verification:

- Integration test can connect to hubs.
- Tenant-scoped message reaches only tenant group subscribers.
- Machine-scoped message reaches only matching machine group subscribers.
- Unauthorized subscription attempts are rejected.

## Phase 7: Telemetry Ingestion and Simulation

Projects: `Ninja.Application`, `Ninja.Infrastructure`, `Ninja.Api`

Deliverables:

- `RecordTelemetrySample` command.
- Telemetry latest and history queries.
- Demo telemetry simulator hosted service.
- Simulation controller to start and stop demo generation.
- Live SignalR updates for telemetry and machine status.
- Tenant-specific sample generation for HarborLift and TerraGrid metrics.

Verification:

- Telemetry samples persist.
- Latest telemetry query returns expected values.
- History query supports time range and metric filters.
- SignalR clients receive updates while simulator runs.

## Phase 8: Command Workflow

Projects: `Ninja.Domain`, `Ninja.Application`, `Ninja.Infrastructure`, `Ninja.Api`

Deliverables:

- `RequestCommand` command.
- Command definition query.
- Command history query.
- Command status query.
- Demo command gateway.
- Command status publisher.
- Operational event records for command lifecycle.

Verification:

- Command request validates tenant, machine, command definition, payload, and authorization.
- Command execution records accepted, rejected, completed, and failed outcomes.
- SignalR clients receive command status updates.
- Command history is tenant-scoped.

## Phase 9: Dashboard Configuration API

Projects: `Ninja.Application`, `Ninja.Infrastructure`, `Ninja.Api`

Deliverables:

- Tenant configuration endpoint.
- Dashboard layout read/write endpoints.
- Telemetry stream catalog endpoint.
- Command definition catalog endpoint.
- Navigation and feature flag data for each tenant.
- Role-aware command visibility.

Verification:

- White-label, HarborLift, and TerraGrid return different configuration.
- Shared controller code serves all tenants.
- Layout update is tenant-scoped and authorization-protected.

## Phase 10: Authentication and Authorization

Projects: `Ninja.Api`, `Ninja.Application`, `Ninja.Infrastructure`

Deliverables:

- JWT bearer authentication.
- Demo token endpoint if needed for local development.
- Tenant access policies.
- Command execution policies.
- Hub authorization.
- Current user and tenant context services.

Verification:

- Missing token receives 401.
- Insufficient permission receives 403.
- Users cannot access another tenant's data.
- Users cannot execute unauthorized commands.
- Hub subscriptions enforce the same tenant rules as controllers.

## Phase 11: Observability and Operations

Project: `Ninja.Api`

Deliverables:

- Structured logging.
- Health checks.
- Request correlation id.
- Basic metrics for command requests, command failures, telemetry samples, and SignalR connections.
- Environment-based configuration.
- Local development settings.

Verification:

- Health endpoint reports API and database state.
- Logs include tenant id, user id when available, command execution id, and correlation id.
- Configuration can run locally without secrets committed to source.

## Phase 12: Integration With Frontend Apps

Projects: backend and frontend apps

Deliverables:

- Frontend API base URL configuration.
- Angular service adapters for HTTP controllers.
- Angular SignalR client setup.
- Dashboard startup flow:
  - Load tenant configuration.
  - Load machine state.
  - Load command definitions.
  - Connect to SignalR hubs.
  - Subscribe to tenant and machine groups.
- Local demo scripts or README commands.

Verification:

- Neutral frontend reads neutral backend config.
- HarborLift frontend reads HarborLift backend config.
- TerraGrid frontend reads TerraGrid backend config.
- Live telemetry appears in all three dashboards.
- Command requests update command history and live status.

## Suggested Implementation Order

1. Scaffold solution, projects, central package management, and tests.
2. Implement Domain models and command state transitions.
3. Implement Application abstractions, feature folder convention, and MediatR pipeline.
4. Add Infrastructure persistence, migrations, and seed data.
5. Add API controllers and `ProblemDetails` mapping.
6. Add SignalR hubs and publisher abstractions.
7. Add telemetry simulation and live telemetry publishing.
8. Add command workflow and live command status.
9. Add dashboard configuration endpoints for all three tenants.
10. Add authentication, authorization, and tenant isolation.
11. Add observability and health checks.
12. Wire frontend apps to HTTP and SignalR.

## Definition of Done

The backend implementation is done when:

- The solution builds and tests pass.
- The API runs locally from `backend`.
- Controllers expose the planned tenant, dashboard, machine, telemetry, command, event, alert, and simulation endpoints.
- SignalR hubs stream live telemetry, command status, alerts, and operational events.
- Application logic goes through MediatR handlers.
- MediatR is pinned to the free no-license-key baseline.
- Domain and Application projects do not depend on Infrastructure or API.
- All three tenants are served by shared backend code.
- Tenant isolation is enforced in controllers, handlers, persistence queries, and SignalR subscriptions.
- Command requests are authorized, audited, persisted, and published through live updates.
- The neutral, HarborLift, and TerraGrid frontend apps can consume the backend without backend forks.

## Source Notes

- .NET support policy: https://dotnet.microsoft.com/en-us/platform/support/policy
- MediatR 12.5.0 package metadata: https://www.nuget.org/packages/MediatR/12.5.0
- Current MediatR package metadata: https://www.nuget.org/packages/MediatR/
- ASP.NET Core SignalR hubs documentation: https://learn.microsoft.com/en-us/aspnet/core/signalr/hubs
