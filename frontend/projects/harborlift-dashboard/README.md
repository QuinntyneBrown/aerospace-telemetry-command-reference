# harborlift-dashboard

Type: Angular library

This library holds HarborLift Robotics dashboard configuration and extensions. It layers logistics-specific brand, telemetry, commands, terminology, tiles, and layout on top of the shared platform.

## Belongs Here

- HarborLift tenant configuration.
- HarborLift theme tokens and terminology.
- Logistics dashboard layout.
- Logistics tile catalog.
- Logistics telemetry stream definitions.
- Logistics command catalog.
- HarborLift route and workflow extensions.

## Keep Out

- Shared dashboard implementation details that belong in `dashboard-platform`.
- TerraGrid-specific field operations behavior.
- App bootstrap code.

## Expected Consumer

`harborlift-robotics` consumes this library plus `dashboard-platform`.

Use `white-label-ui` for dumb reusable presentation components. Create a HarborLift-specific UI library only if HarborLift needs reusable visual components that cannot be expressed through theme tokens and configuration.

## Commands

```bash
npx ng build harborlift-dashboard
```
