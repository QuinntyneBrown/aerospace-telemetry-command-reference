# harborlift-robotics

Type: Angular application

This is the HarborLift Robotics branded dashboard app. It should stay thin and compose the shared platform with the HarborLift dashboard extension library.

## Composition

- `dashboard-platform`: shared shell, UI, telemetry, command, tile, and layout primitives.
- `white-label-ui`: dumb reusable presentation components.
- `harborlift-dashboard`: HarborLift brand configuration, logistics telemetry, logistics commands, logistics tiles, and workflows.

## Keep Out

- Shared platform implementation.
- TerraGrid-specific field operations behavior.
- Neutral white-label configuration.

## Commands

```bash
npx ng serve harborlift-robotics
npx ng build harborlift-robotics
```
