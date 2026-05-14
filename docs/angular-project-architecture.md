# Angular Project Architecture for White-Label Dashboards

## Purpose

The `frontend` workspace demonstrates a simple Angular structure for one white-label dashboard product and multiple branded dashboard variants.

The point of the repository is not to create many libraries. The point is to show a clean separation between:

- A shared dashboard platform.
- A shared white-label UI component library.
- A neutral white-label dashboard configuration.
- Branded dashboard configurations and extensions.
- Thin Angular apps that compose those pieces.

## Radical Simple Structure

The frontend should use three apps and five libraries.

```text
frontend/
  projects/
    white-label-operations-console/  # neutral app
    harborlift-robotics/             # logistics branded app
    terragrid-autonomy/              # field robotics branded app

    white-label-ui/                  # dumb reusable UI components
    dashboard-platform/              # shared platform library
    white-label-dashboard/           # neutral dashboard config
    harborlift-dashboard/            # logistics brand config and extensions
    terragrid-dashboard/             # field brand config and extensions
```

This is enough to demonstrate the architecture without burying the idea under too many project boundaries.

## Applications

### `white-label-operations-console`

The neutral reference app.

It should compose:

- `dashboard-platform`
- `white-label-ui`
- `white-label-dashboard`

It should not contain HarborLift or TerraGrid logic.

### `harborlift-robotics`

The logistics robotics branded app.

It should compose:

- `dashboard-platform`
- `white-label-ui`
- `harborlift-dashboard`

It should stay thin. HarborLift-specific tiles, commands, telemetry, theme tokens, labels, and workflows belong in `harborlift-dashboard`.

### `terragrid-autonomy`

The field robotics branded app.

It should compose:

- `dashboard-platform`
- `white-label-ui`
- `terragrid-dashboard`

It should stay thin. TerraGrid-specific tiles, commands, telemetry, theme tokens, labels, and workflows belong in `terragrid-dashboard`.

## Libraries

### `white-label-ui`

The shared white-label UI component library.

This library should contain simple reusable presentation components:

- Buttons.
- Cards.
- Status chips.
- Empty states.
- Toolbars.
- Form controls.
- Table presentation components.
- Dumb chart containers.
- Angular Material wrappers used consistently across dashboards.

These components should be dumb: inputs in, events out. They should not know about tenants, telemetry streams, command catalogs, dashboard layouts, HarborLift, or TerraGrid.

Use Material 3 theme tokens and CSS variables so branded dashboards can restyle the same components without forking them.

### `dashboard-platform`

The shared white-label dashboard platform.

This library should contain the reusable building blocks that every dashboard needs:

- Dashboard shell primitives.
- Common domain models.
- Tenant configuration contracts.
- Tile definition contracts and tile grid behavior.
- Edit mode for adding, removing, and resizing tiles.
- Shared Chart.js wrappers.
- Shared telemetry display primitives.
- Shared command workflow primitives.
- Provider tokens for registering tiles, commands, telemetry streams, navigation, and theme values.

This library can consume `white-label-ui`, but it should not know about HarborLift or TerraGrid.

### `white-label-dashboard`

The neutral product configuration.

This library should contain:

- Neutral tenant configuration.
- Neutral dashboard layout.
- Generic dashboard tiles.
- Generic telemetry definitions.
- Generic command definitions.
- Neutral terminology and navigation.

This library demonstrates the base product before a customer brand is applied.

### `harborlift-dashboard`

The HarborLift branded dashboard extension.

This library should contain:

- HarborLift tenant configuration.
- HarborLift theme tokens and terminology.
- Logistics-specific dashboard layout.
- Logistics tiles.
- Logistics telemetry definitions.
- Logistics commands.
- Logistics route and workflow extensions.

Examples include yard status, dock queues, charging queues, blocked paths, container move progress, AMR utilization, reroute commands, return-to-charger commands, and handoff confirmation.

### `terragrid-dashboard`

The TerraGrid branded dashboard extension.

This library should contain:

- TerraGrid tenant configuration.
- TerraGrid theme tokens and terminology.
- Field-operations dashboard layout.
- Field robotics tiles.
- Field telemetry definitions.
- Field commands.
- Field route and workflow extensions.

Examples include field coverage, route progress, weather, terrain state, payload status, inspection progress, hazard markers, adjust-route commands, pause-implement commands, and return-to-base commands.

## Dependency Direction

Use one-way dependencies.

```text
applications
  -> dashboard-specific libraries
  -> dashboard-platform
  -> white-label-ui
```

Allowed:

- `white-label-operations-console` imports `white-label-dashboard` and `dashboard-platform`.
- `harborlift-robotics` imports `harborlift-dashboard` and `dashboard-platform`.
- `terragrid-autonomy` imports `terragrid-dashboard` and `dashboard-platform`.
- Dashboard-specific libraries import shared contracts and primitives from `dashboard-platform`.
- `dashboard-platform` imports dumb reusable components from `white-label-ui`.
- Dashboard-specific libraries may import `white-label-ui` for branded tile presentation.

Not allowed:

- `dashboard-platform` imports `harborlift-dashboard`.
- `dashboard-platform` imports `terragrid-dashboard`.
- `white-label-ui` imports `dashboard-platform`.
- `white-label-dashboard` contains HarborLift or TerraGrid logic.
- Branded apps copy shared platform code instead of using `dashboard-platform`.

## Brand-Specific UI Libraries

Do not create branded UI libraries by default.

Most brand differences should be handled through:

- Material 3 theme tokens.
- CSS variables.
- Brand configuration.
- Dashboard-specific tile, telemetry, and command definitions.

Create a branded UI library only when a brand has reusable dumb visual components that are genuinely different from the white-label components and are reused across multiple branded features.

Possible future libraries:

```text
harborlift-ui
terragrid-ui
```

Those should stay dumb too. Brand workflows still belong in `harborlift-dashboard` and `terragrid-dashboard`.

## Extension Model

Use Angular providers and typed configuration to keep the apps thin.

The shared platform should expose provider tokens such as:

```ts
export const TENANT_CONFIG = new InjectionToken<TenantConfig>('TENANT_CONFIG');
export const DASHBOARD_TILES = new InjectionToken<DashboardTileDefinition[]>('DASHBOARD_TILES');
export const COMMAND_DEFINITIONS = new InjectionToken<CommandDefinition[]>('COMMAND_DEFINITIONS');
export const TELEMETRY_STREAMS = new InjectionToken<TelemetryStreamDefinition[]>('TELEMETRY_STREAMS');
```

Each dashboard-specific library can export one provider function.

```ts
export function provideHarborLiftDashboard(): Provider[] {
  return [
    { provide: TENANT_CONFIG, useValue: harborLiftTenant },
    { provide: DASHBOARD_TILES, multi: true, useValue: harborLiftTiles },
    { provide: COMMAND_DEFINITIONS, multi: true, useValue: harborLiftCommands },
    { provide: TELEMETRY_STREAMS, multi: true, useValue: harborLiftTelemetry },
  ];
}
```

The app bootstrap then stays small.

```ts
bootstrapApplication(App, {
  providers: [
    provideDashboardPlatform(),
    provideHarborLiftDashboard(),
  ],
});
```

## What This Demonstrates

This structure demonstrates that:

- One shared Angular library can hold the white-label dashboard platform.
- One shared UI library can hold reusable dumb components.
- Each branded dashboard can provide its own tiles, telemetry, commands, theme, terminology, and workflows.
- The apps remain deployment shells instead of becoming product forks.
- New branded dashboards can be added by creating one new app and one new dashboard-specific library.

## Success Criteria

The structure is successful when:

- The base app runs without branded code.
- HarborLift and TerraGrid can diverge meaningfully without changing shared platform code.
- Shared behavior is fixed once in `dashboard-platform`.
- Brand-specific behavior is easy to find.
- The project remains small enough for someone to understand the white-label pattern quickly.
