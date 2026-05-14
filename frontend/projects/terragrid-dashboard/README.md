# terragrid-dashboard

Type: Angular library scaffold

This library holds TerraGrid Autonomy dashboard configuration and extensions. It demonstrates how a branded field robotics dashboard can layer domain-specific features on top of the shared platform.

## Belongs Here

- TerraGrid tenant configuration.
- TerraGrid theme tokens and terminology.
- Field operations dashboard layout.
- Field robotics tile catalog.
- Field telemetry stream definitions.
- Field command catalog.
- TerraGrid route and workflow extensions.

## Keep Out

- Shared dashboard implementation details that belong in `dashboard-platform`.
- HarborLift-specific logistics behavior.
- App bootstrap code.

## Expected Consumer

`terragrid-autonomy` should consume this library plus `dashboard-platform`.

Use `white-label-ui` for dumb reusable presentation components. Create a TerraGrid-specific UI library only if TerraGrid needs reusable visual components that cannot be expressed through theme tokens and configuration.

## Commands

```bash
npx ng build terragrid-dashboard
```
