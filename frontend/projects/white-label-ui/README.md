# white-label-ui

Type: Angular library scaffold

This library is for simple reusable presentation components. These should be dumb components: inputs in, events out, no dashboard business rules.

## Belongs Here

- Reusable Angular Material wrappers.
- Buttons, cards, status chips, empty states, toolbars, form controls, and table presentation components.
- Dumb chart container components that do not know specific telemetry streams.
- Shared visual components that can be used by the platform and every branded dashboard.

## Keep Out

- Tenant configuration.
- Tile catalogs.
- Telemetry definitions.
- Command definitions.
- Dashboard shell orchestration.
- HarborLift- or TerraGrid-specific business workflows.

## Brand-Specific UI

Do not create brand-specific UI libraries by default. Prefer theme tokens, CSS variables, Material 3 theming, and dashboard configuration first.

Create a branded UI library later only if a brand has reusable dumb components that are genuinely different from the white-label components and are reused across multiple features. Possible future names:

- `harborlift-ui`
- `terragrid-ui`

## Expected Consumers

`dashboard-platform` should use this library for reusable presentation components. Dashboard-specific libraries can also use it when defining branded tiles and workflows.

## Commands

```bash
npx ng build white-label-ui
```
