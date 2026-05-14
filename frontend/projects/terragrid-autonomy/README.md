# terragrid-autonomy

Type: Angular application

This is the TerraGrid Autonomy branded dashboard app. It should stay thin and compose the shared platform with the TerraGrid dashboard extension library.

## Composition

- `dashboard-platform`: shared shell, UI, telemetry, command, tile, and layout primitives.
- `white-label-ui`: dumb reusable presentation components.
- `terragrid-dashboard`: TerraGrid brand configuration, field telemetry, field commands, field robotics tiles, and workflows.

## Keep Out

- Shared platform implementation.
- HarborLift-specific logistics behavior.
- Neutral white-label configuration.

## Commands

```bash
npx ng serve terragrid-autonomy
npx ng build terragrid-autonomy
```
