# white-label-dashboard

Type: Angular library scaffold

This library holds the neutral white-label dashboard configuration. It demonstrates how the shared platform is composed before customer-specific branding is applied.

## Belongs Here

- Default tenant configuration.
- Neutral dashboard layout.
- Generic tile catalog.
- Generic telemetry stream definitions.
- Generic command catalog.
- Neutral labels, terminology, and navigation.

## Keep Out

- Shared implementation details that belong in `dashboard-platform`.
- HarborLift-specific logistics behavior.
- TerraGrid-specific field operations behavior.
- App bootstrap code.

## Expected Consumer

`white-label-operations-console` should consume this library plus `dashboard-platform`.

Use `white-label-ui` for dumb reusable presentation components.

## Commands

```bash
npx ng build white-label-dashboard
```
