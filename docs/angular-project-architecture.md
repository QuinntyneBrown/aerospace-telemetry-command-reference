# Angular Project Architecture for White-Label Dashboards

## Purpose

The `frontend` workspace is the Angular codebase for Viam's white-label dashboard product and its branded dashboard variants. The goal is to build one reusable dashboard platform, then compose multiple branded applications from that shared foundation.

This structure should make it possible for Viam to maintain common telemetry, command, layout, charting, and UI behavior in shared Angular libraries while allowing each branded dashboard to add its own theme, terminology, telemetry streams, commands, tiles, workflows, and domain-specific features.

The important architectural rule is that branded dashboards should extend the platform. They should not fork the platform.

## Current Angular Applications

The Angular workspace currently defines three application projects.

| Angular project | Purpose | Product role |
| --- | --- | --- |
| `white-label-operations-console` | Neutral base dashboard | Shows the reusable product without customer-specific branding |
| `harborlift-robotics` | Logistics robotics dashboard | Branded dashboard for ports, yards, warehouses, AMRs, charging queues, and material movement |
| `terragrid-autonomy` | Field robotics dashboard | Branded dashboard for outdoor robots, GPS routes, field coverage, terrain, weather, payloads, and inspection workflows |

Each application should be thin. The application project should mostly bootstrap Angular, provide the correct tenant configuration, import the required shared and branded feature providers, and define app-level routing.

## Technology Foundation

The frontend should use:

- **Angular** for applications, routing, dependency injection, stateful UI composition, and library boundaries.
- **Angular Material** (`@angular/material`) as the main UI component library.
- **Angular CDK** (`@angular/cdk`) for lower-level interaction patterns such as overlays, drag/drop, accessibility helpers, portals, and layout utilities.
- **Chart.js** for telemetry and operational charts.
- **SCSS** for application and library styling, with Material 3 theme tokens exposed through shared theming utilities.

## Recommended Project Shape

The workspace should separate applications from reusable libraries.

```text
frontend/
  projects/
    white-label-operations-console/
    harborlift-robotics/
    terragrid-autonomy/

    dashboard-domain/
    dashboard-data-access/
    dashboard-shell/
    dashboard-layout/
    dashboard-ui/
    dashboard-theming/
    dashboard-telemetry/
    dashboard-commands/
    dashboard-tiles/
    dashboard-testing/

    white-label-dashboard/
    harborlift-brand/
    harborlift-features/
    terragrid-brand/
    terragrid-features/
```

The exact library names can change, but the separation should remain stable:

- Shared platform libraries hold reusable dashboard capabilities.
- Brand libraries hold customer-specific customization.
- Application projects compose the correct set of shared and branded libraries.

## Application Projects

### `white-label-operations-console`

This is the neutral reference application. It should demonstrate the platform before brand-specific extensions are applied.

Responsibilities:

- Bootstrap the shared dashboard shell.
- Provide the default white-label tenant configuration.
- Register generic fleet, telemetry, command, alert, map, audit, and device-detail tiles.
- Use neutral terminology such as "Machines", "Fleet", "Commands", "Telemetry", and "Operating Area".
- Serve as the baseline for regression testing shared platform behavior.

This app should avoid logistics- or field-specific assumptions. If a feature only makes sense for a customer domain, it belongs in a branded feature library.

### `harborlift-robotics`

This is the logistics robotics branded application.

Responsibilities:

- Provide HarborLift brand theme, logo assets, navigation labels, and terminology.
- Register logistics-specific telemetry streams such as dock utilization, aisle congestion, handoff status, route blockage, charging queue, and container move progress.
- Register logistics-specific commands such as pause mission, reroute, return to charger, set speed limit, yield, and confirm handoff.
- Add dashboard tiles for yard status, dock queues, AMR utilization, blocked paths, charging stations, and move throughput.
- Extend the shared dashboard with workflows for material movement and logistics operations.

The app should feel purpose-built for structured logistics environments while still using the same dashboard platform as the white-label app.

### `terragrid-autonomy`

This is the field robotics branded application.

Responsibilities:

- Provide TerraGrid brand theme, logo assets, navigation labels, and terminology.
- Register field-specific telemetry streams such as GPS position, route progress, terrain status, weather, soil conditions, payload state, coverage percentage, and hazard markers.
- Register field-specific commands such as return to base, pause implement, adjust route, reduce speed, start inspection pass, and mark hazard.
- Add dashboard tiles for field coverage, route progress, weather conditions, terrain risk, payload health, and inspection progress.
- Extend the shared dashboard with workflows for outdoor supervision, mapping, inspection, and agriculture-adjacent operations.

The app should feel rugged and field-ready while still using the same core dashboard platform.

## Shared Platform Libraries

### `dashboard-domain`

Contains pure TypeScript models and contracts shared across every dashboard.

Examples:

- `Machine`
- `FleetStatus`
- `TelemetrySample`
- `TelemetryStreamDefinition`
- `CommandDefinition`
- `CommandRequest`
- `CommandResult`
- `CommandAuditEntry`
- `DashboardTileDefinition`
- `TenantConfig`
- `BrandTheme`
- `NavigationItem`
- `DashboardLayout`

Rules:

- No Angular Material imports.
- No app-specific imports.
- No brand-specific logic.
- Prefer interfaces, types, enums, and pure helper functions.

### `dashboard-data-access`

Contains API clients, data adapters, repository services, simulators, and websocket or polling integration points.

Examples:

- Fleet telemetry client.
- Command dispatch client.
- Event stream client.
- Tenant configuration loader.
- Mock telemetry generator for demos.
- API response adapters that convert backend payloads into `dashboard-domain` models.

Rules:

- Depend on `dashboard-domain`.
- Expose interfaces so branded dashboards can provide alternate data sources.
- Keep UI components out of this library.

### `dashboard-shell`

Contains the reusable application shell used by all dashboards.

Examples:

- Top app bar.
- Navigation rail or sidenav.
- Dashboard route container.
- Tenant switcher.
- User menu.
- Alert drawer.
- Command audit drawer.
- Layout edit mode entry point.

Rules:

- Depend on shared UI, layout, theming, tiles, commands, and telemetry libraries.
- Accept customization through configuration and Angular providers.
- Do not import brand libraries directly.

### `dashboard-layout`

Contains dashboard layout primitives.

Examples:

- Tile grid.
- Tile resize controls.
- Tile add/remove behavior.
- Saved layouts.
- Layout presets.
- Edit mode.
- Responsive tile sizing.

Rules:

- Know how to render and manage tile containers.
- Do not know what a logistics tile or field tile means.
- Persist layout using domain models, not component implementation details.

### `dashboard-ui`

Contains shared Angular Material based UI primitives.

Examples:

- Page headers.
- Metric cards.
- Status chips.
- Empty states.
- Toolbars.
- Icon buttons.
- Confirmation dialogs.
- Filter controls.
- Data table wrappers.
- Form field patterns.

Rules:

- Use Angular Material and Angular CDK consistently.
- Keep components generic.
- Avoid robotics-domain business rules unless the component is purely presentational and reusable.

### `dashboard-theming`

Contains Material 3 theme setup and brand token handling.

Examples:

- Theme tokens.
- Dark and light theme utilities.
- Material theme mixins.
- Brand color mapping.
- Density and typography defaults.
- Runtime tenant theme application.

Rules:

- Shared libraries should consume theme tokens instead of hard-coded brand colors.
- Brand libraries should provide tokens, not rewrite shared component styles.

### `dashboard-telemetry`

Contains reusable telemetry visualization components and services.

Examples:

- Chart.js wrapper components.
- Line chart tile.
- Sparkline tile.
- Telemetry stream table.
- Machine health summary.
- Battery and thermal panels.
- Telemetry quality indicators.

Rules:

- Depend on Chart.js through stable wrapper components.
- Accept telemetry definitions and data as inputs.
- Keep brand-specific telemetry definitions in brand libraries.

### `dashboard-commands`

Contains reusable command workflows.

Examples:

- Command palette.
- Command detail panel.
- Command confirmation dialog.
- Command policy checks.
- Command dispatch status.
- Audit history.
- Role-aware command availability.

Rules:

- Shared command UI should understand command metadata, authorization state, and execution status.
- Brand libraries should provide command definitions and labels.
- Dangerous commands should be gated consistently across all branded apps.

### `dashboard-tiles`

Contains the shared tile registry and base tile implementations.

Examples:

- Tile registry service.
- Tile definition token.
- Generic metric tile.
- Generic telemetry chart tile.
- Fleet status tile.
- Event stream tile.
- Command center tile.
- Operating area tile.

Rules:

- Tiles should be registered by definition, not hard-coded into the shell.
- Shared tiles should be reusable across all apps.
- Brand libraries can add new tile definitions without changing the shell.

### `dashboard-testing`

Contains shared test utilities.

Examples:

- Mock tenant configurations.
- Mock telemetry streams.
- Mock command definitions.
- Component harness helpers.
- Chart test helpers.
- Layout test fixtures.

Rules:

- Keep tests consistent across white-label and branded dashboards.
- Make it easy to verify that branded apps did not break shared platform behavior.

## Brand Libraries

### `white-label-dashboard`

Contains default product configuration for the neutral dashboard.

Examples:

- Default tenant config.
- Default dashboard layout.
- Default command catalog.
- Default tile set.
- Neutral labels and terminology.

This library can be used by `white-label-operations-console` and by tests that need a baseline tenant.

### `harborlift-brand`

Contains HarborLift visual identity and terminology.

Examples:

- Brand colors.
- Logo assets.
- Material theme config.
- Typography and density preferences.
- Terms such as "Yard", "Dock", "AMR", "Move", "Handoff", and "Charging Queue".

### `harborlift-features`

Contains HarborLift-specific dashboard extensions.

Examples:

- HarborLift tile definitions.
- Logistics telemetry definitions.
- Logistics commands.
- HarborLift-specific routes.
- HarborLift-specific workflows and panels.

This library should depend on shared platform libraries, but shared platform libraries must not depend on it.

### `terragrid-brand`

Contains TerraGrid visual identity and terminology.

Examples:

- Brand colors.
- Logo assets.
- Material theme config.
- Typography and density preferences.
- Terms such as "Field", "Route", "Coverage", "Inspection", "Payload", and "Hazard".

### `terragrid-features`

Contains TerraGrid-specific dashboard extensions.

Examples:

- TerraGrid tile definitions.
- Field telemetry definitions.
- Field commands.
- TerraGrid-specific routes.
- TerraGrid-specific workflows and panels.

This library should depend on shared platform libraries, but shared platform libraries must not depend on it.

## Dependency Direction

Use one-way dependencies.

```text
applications
  -> brand feature libraries
  -> brand theme libraries
  -> shared platform libraries
  -> dashboard-domain
```

Allowed:

- `harborlift-robotics` imports `harborlift-features`.
- `harborlift-features` imports `dashboard-tiles`, `dashboard-commands`, `dashboard-telemetry`, and `dashboard-domain`.
- `dashboard-shell` imports shared platform libraries.
- `dashboard-ui` imports Angular Material and Angular CDK.
- `dashboard-telemetry` imports Chart.js.

Not allowed:

- `dashboard-shell` imports `harborlift-features`.
- `dashboard-tiles` imports `terragrid-features`.
- `dashboard-domain` imports Angular Material.
- `white-label-operations-console` contains HarborLift or TerraGrid logic.
- A branded app copies shared dashboard components instead of configuring or extending them.

## Extension Model

The platform should expose extension points through Angular dependency injection and typed configuration.

Useful provider tokens:

```ts
export const TENANT_CONFIG = new InjectionToken<TenantConfig>('TENANT_CONFIG');
export const DASHBOARD_TILES = new InjectionToken<DashboardTileDefinition[]>('DASHBOARD_TILES');
export const COMMAND_DEFINITIONS = new InjectionToken<CommandDefinition[]>('COMMAND_DEFINITIONS');
export const TELEMETRY_STREAMS = new InjectionToken<TelemetryStreamDefinition[]>('TELEMETRY_STREAMS');
export const NAVIGATION_EXTENSIONS = new InjectionToken<NavigationItem[]>('NAVIGATION_EXTENSIONS');
```

Shared platform components should read from these tokens. Branded libraries should provide values for these tokens.

Example:

```ts
export const provideHarborLiftDashboard = () => [
  { provide: TENANT_CONFIG, useValue: harborLiftTenantConfig },
  { provide: DASHBOARD_TILES, multi: true, useValue: harborLiftTiles },
  { provide: COMMAND_DEFINITIONS, multi: true, useValue: harborLiftCommands },
  { provide: TELEMETRY_STREAMS, multi: true, useValue: harborLiftTelemetryStreams },
  { provide: NAVIGATION_EXTENSIONS, multi: true, useValue: harborLiftNavigation },
];
```

Then the branded app stays thin:

```ts
bootstrapApplication(App, {
  providers: [
    provideDashboardShell(),
    provideHarborLiftDashboard(),
  ],
});
```

## Tile Customization

Tiles are the primary way branded dashboards should customize the user experience.

Shared tile capabilities:

- Tile registry.
- Add/remove/resize behavior.
- Layout persistence.
- Tile permissions.
- Tile data loading state.
- Tile error state.
- Tile empty state.

Shared tile examples:

- Fleet overview.
- Machine status.
- Telemetry line chart.
- Command center.
- Event stream.
- Operating area map.
- Alert list.

HarborLift tile examples:

- Yard throughput.
- Dock queue.
- Container move progress.
- Blocked path alerts.
- Charging queue.
- AMR utilization.

TerraGrid tile examples:

- Field coverage.
- Route progress.
- Weather and terrain.
- Payload status.
- Hazard markers.
- Inspection pass progress.

The shell should never hard-code a brand-specific tile. It should render the registered tile catalog for the current tenant.

## Telemetry Customization

The shared platform should define common telemetry concepts, but branded dashboards should own the domain-specific streams.

Common telemetry:

- Online/offline state.
- Battery.
- Temperature.
- Position.
- Mission state.
- Alert state.
- Telemetry quality.
- Command latency.

HarborLift telemetry:

- Container move progress.
- Dock status.
- Yard zone congestion.
- Blocked route state.
- Charging queue depth.
- Handoff status.

TerraGrid telemetry:

- GPS route progress.
- Field coverage.
- Weather conditions.
- Terrain status.
- Soil conditions.
- Payload or implement state.
- Hazard markers.

Reusable Chart.js components should accept stream definitions, labels, units, thresholds, and color tokens rather than embedding product-specific assumptions.

## Command Customization

Commands should be modeled as metadata plus execution policy.

Shared command fields:

- Command id.
- Display label.
- Description.
- Icon.
- Required role or permission.
- Confirmation level.
- Parameter schema.
- Target machine types.
- Audit category.
- Execution handler.

Common commands:

- Pause.
- Resume.
- Return to base.
- Restart component.
- Lock out.
- Clear alert.

HarborLift commands:

- Reroute.
- Return to charger.
- Set speed limit.
- Yield.
- Confirm handoff.
- Pause container move.

TerraGrid commands:

- Pause implement.
- Adjust route.
- Reduce speed.
- Start inspection pass.
- Mark hazard.
- Return to base.

The command UI should be shared. The command catalog should be brand-specific.

## Theming and Branding

Branding should be provided through configuration and theme tokens.

Brand-specific inputs:

- Product name.
- Logo.
- Color palette.
- Material 3 theme.
- Typography preference.
- Density preference.
- Terminology map.
- Default dashboard layout.
- Navigation labels.

Shared components should use semantic tokens:

- `primary`
- `secondary`
- `tertiary`
- `surface`
- `error`
- `warning`
- `success`
- `on-surface`
- `outline`

Avoid hard-coding HarborLift or TerraGrid colors inside shared libraries.

## Routing Strategy

Each app should define only the top-level route composition it owns.

Shared routes:

- Dashboard.
- Fleet.
- Machine detail.
- Commands.
- Events.
- Settings.

Brand-specific route extensions:

- HarborLift yard view.
- HarborLift dock operations.
- HarborLift charging queue.
- TerraGrid field map.
- TerraGrid inspection route.
- TerraGrid hazard review.

The shared shell can render navigation from `NavigationItem` definitions so branded libraries can add routes without modifying the base shell.

## Testing Strategy

Shared platform tests should prove that the white-label product works without brand-specific code.

Brand tests should prove that the brand correctly registers its extensions and that its custom workflows work.

Recommended test coverage:

- `dashboard-domain`: pure model and helper tests.
- `dashboard-layout`: tile add/remove/resize and layout persistence.
- `dashboard-tiles`: tile registry and tile rendering.
- `dashboard-commands`: command gating, confirmation, dispatch, and audit behavior.
- `dashboard-telemetry`: chart wrapper inputs, thresholds, empty states, and loading states.
- `harborlift-features`: logistics tile registration and command definitions.
- `terragrid-features`: field tile registration and command definitions.
- Applications: smoke tests that bootstrap the correct tenant configuration.

## Build and Ownership Model

Each branded app should be independently buildable and deployable.

Example commands:

```bash
npm run build -- white-label-operations-console
npm run build -- harborlift-robotics
npm run build -- terragrid-autonomy
```

Ownership should follow the library boundaries:

- Platform team owns shared libraries.
- Brand or solution teams own branded feature libraries.
- Application projects stay small and are owned by the team responsible for the deployed branded experience.

## Decision Checklist

When adding a new feature, use this checklist:

- If every dashboard needs it, put it in a shared platform library.
- If only one brand needs it, put it in that brand's feature library.
- If it is visual identity, put it in a brand library or theming configuration.
- If it is a reusable UI primitive, put it in `dashboard-ui`.
- If it is a reusable tile capability, put it in `dashboard-tiles` or `dashboard-layout`.
- If it is a tile definition for a customer domain, put it in the brand feature library.
- If it is a telemetry model used by many apps, put it in `dashboard-domain`.
- If it is a telemetry stream only one brand understands, put it in the brand feature library.
- If it dispatches a command, model the command in shared contracts and register the specific command in the appropriate catalog.

## Success Criteria

The architecture is successful when:

- The base dashboard can run without HarborLift or TerraGrid code.
- HarborLift and TerraGrid can add meaningful domain features without changing shared shell code.
- Shared bugs are fixed once and benefit every dashboard.
- Brand-specific behavior is easy to find and does not leak into neutral platform libraries.
- Tiles, telemetry streams, commands, and navigation can be registered by configuration or providers.
- Each branded dashboard feels purpose-built, not like a simple color swap.
