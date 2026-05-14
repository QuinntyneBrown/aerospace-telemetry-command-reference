# white-label-operations-console

Type: Angular application

This is the neutral white-label dashboard app. It should stay thin and compose the shared platform with the neutral dashboard configuration library.

## Composition

- `dashboard-platform`: shared shell, UI, telemetry, command, tile, and layout primitives.
- `white-label-ui`: dumb reusable presentation components.
- `white-label-dashboard`: neutral tenant configuration, tiles, commands, telemetry, labels, and layout.

## Keep Out

- Shared platform implementation.
- HarborLift-specific logistics behavior.
- TerraGrid-specific field operations behavior.

## Commands

```bash
npx ng serve white-label-operations-console
npx ng build white-label-operations-console
```
