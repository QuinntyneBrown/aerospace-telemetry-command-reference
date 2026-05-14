# dashboard-platform

Type: Angular library

This is the shared runtime library for the dashboard product. It owns the reusable shell, tile grid, edit mode behavior, service contracts, default runtime services, Chart.js wrapper, telemetry adapter, and command dispatch integration.

## Belongs Here

- Shared dashboard shell concepts.
- Shared domain models for machines, telemetry, commands, tiles, layouts, and tenants.
- Tile grid and edit-mode behavior.
- Shared Chart.js wrappers.
- Shared command workflow primitives.
- Shared provider tokens used by dashboard-specific libraries.

## Keep Out

- HarborLift-specific logistics behavior.
- TerraGrid-specific field operations behavior.
- App bootstrap code.

## Expected Consumers

All three apps depend on this library:

- `white-label-operations-console`
- `harborlift-robotics`
- `terragrid-autonomy`

The dashboard-specific libraries should also depend on this library.

`dashboard-platform` consumes `white-label-ui` for dumb reusable presentation components and consumes runtime services through interface-backed injection tokens.

## Commands

```bash
npx ng build dashboard-platform
```
