# Ninja Reference Backend

.NET backend for the white-label robotics telemetry and command dashboard.

## Stack

- .NET 10
- ASP.NET Core controllers
- SignalR hubs
- Clean Architecture projects
- MediatR `12.5.0`
- EF Core with SQLite or in-memory database
- JWT bearer authentication

## Projects

```text
src/
  Ninja.Api
  Ninja.Application
  Ninja.Domain
  Ninja.Infrastructure

tests/
  Ninja.Api.Tests
  Ninja.Application.Tests
  Ninja.Domain.Tests
  Ninja.Infrastructure.Tests
```

## Commands

```bash
dotnet restore Ninja.ReferenceArchitecture.sln
dotnet build Ninja.ReferenceArchitecture.sln
dotnet test Ninja.ReferenceArchitecture.sln
dotnet run --project src/Ninja.Api/Ninja.Api.csproj
```

Development uses an in-memory database by default through `appsettings.Development.json`.

Production-style local runs use SQLite through `ConnectionStrings:DefaultConnection`; startup applies EF migrations and then seeds the demo tenants.

## Demo Auth

Create a demo JWT:

```bash
curl -X POST http://localhost:5000/api/v1/auth/demo-token \
  -H "Content-Type: application/json" \
  -d "{}"
```

Use the returned `accessToken` as a bearer token for protected endpoints.

## Key Endpoints

```text
GET  /api/v1/tenants
GET  /api/v1/dashboard-configuration/{tenantSlug}
GET  /api/v1/tenants/{tenantSlug}/machines
GET  /api/v1/tenants/{tenantSlug}/machines/{machineId}/telemetry/latest
GET  /api/v1/tenants/{tenantSlug}/commands/definitions
POST /api/v1/tenants/{tenantSlug}/machines/{machineId}/commands
GET  /api/v1/tenants/{tenantSlug}/events
GET  /api/v1/tenants/{tenantSlug}/alerts
POST /api/v1/simulation/{tenantSlug}/start
POST /api/v1/simulation/{tenantSlug}/stop
```

## SignalR Hubs

```text
/hubs/telemetry
/hubs/operations
```

Both hubs require the same bearer token used by the HTTP API. Clients can subscribe by tenant or by tenant plus machine id.
