# dashboard-platform

Type: Angular library scaffold

This is the single shared platform library for the dashboard product. It exists to keep the repo simple while still demonstrating the white-label architecture.

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

All three apps should eventually depend on this library:

- `white-label-operations-console`
- `harborlift-robotics`
- `terragrid-autonomy`

The dashboard-specific libraries should also depend on this library.

`dashboard-platform` can consume `white-label-ui` for dumb reusable presentation components.

## Commands

```bash
npx ng build dashboard-platform
```
