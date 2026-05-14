# Frontend Implementation Plan

## Goal

Build the Angular frontend as a reference implementation of a white-label robotics dashboard that can be extended into multiple branded dashboards without forking the shared product.

The finished frontend should demonstrate:

- A neutral white-label operations console.
- A HarborLift Robotics logistics dashboard.
- A TerraGrid Autonomy field robotics dashboard.
- Shared dashboard behavior in common libraries.
- Brand-specific tiles, telemetry, commands, terminology, themes, and workflows supplied through configuration and providers.

## Project Shape

The frontend uses three Angular applications and five libraries.

```text
frontend/projects/
  white-label-operations-console/
  harborlift-robotics/
  terragrid-autonomy/

  white-label-ui/
  dashboard-platform/
  white-label-dashboard/
  harborlift-dashboard/
  terragrid-dashboard/
```

## Implementation Principles

- Keep apps thin. Apps should bootstrap Angular, apply providers, and host routes.
- Put reusable dumb UI in `white-label-ui`.
- Put reusable dashboard behavior in `dashboard-platform`.
- Put neutral dashboard configuration in `white-label-dashboard`.
- Put HarborLift-specific configuration and extensions in `harborlift-dashboard`.
- Put TerraGrid-specific configuration and extensions in `terragrid-dashboard`.
- Use Angular Material for UI controls and Material 3 theming.
- Use Chart.js through platform-level wrappers, not directly throughout branded feature code.
- Use provider tokens for tenant config, tile catalogs, command catalogs, telemetry streams, navigation, and dashboard layouts.

## Phase 1: Shared UI Foundation

Project: `white-label-ui`

Build simple, dumb reusable components.

Deliverables:

- Button and icon-button wrappers.
- Status chip.
- Metric card.
- Toolbar/header primitives.
- Empty state.
- Key-value list.
- Simple table/list presentation components.
- Chart panel shell that accepts projected chart content.
- Shared UI model types for option lists, tones, actions, and display rows.

Rules:

- Components receive data through inputs.
- Components emit user intent through outputs.
- No tenant logic.
- No telemetry business rules.
- No command execution.
- No HarborLift or TerraGrid references.

Verification:

- `npx ng build white-label-ui`
- Component-level tests for inputs, outputs, disabled states, and basic rendering.

## Phase 2: Dashboard Platform Contracts

Project: `dashboard-platform`

Create the shared contracts and provider tokens that all dashboards use.

Deliverables:

- `TenantConfig`
- `BrandTheme`
- `NavigationItem`
- `Machine`
- `TelemetryStreamDefinition`
- `TelemetrySample`
- `CommandDefinition`
- `CommandRequest`
- `CommandResult`
- `DashboardTileDefinition`
- `DashboardLayout`
- Provider tokens:
  - `TENANT_CONFIG`
  - `DASHBOARD_TILES`
  - `COMMAND_DEFINITIONS`
  - `TELEMETRY_STREAMS`
  - `DASHBOARD_LAYOUT`
  - `NAVIGATION_ITEMS`

Verification:

- `npx ng build dashboard-platform`
- Type-only unit tests for helper functions and default config merging.

## Phase 3: Dashboard Platform Runtime

Project: `dashboard-platform`

Build the reusable dashboard runtime.

Deliverables:

- Dashboard shell component.
- Navigation rail or side navigation.
- Top app bar.
- Tenant-aware page title and status area.
- Tile registry service.
- Tile grid component.
- Edit mode:
  - Toggle edit mode.
  - Add tile from registered catalog.
  - Remove tile.
  - Resize tile.
  - Lock all editing behavior outside edit mode.
- Chart.js wrapper component for smooth line charts.
- Telemetry stream adapter for demo data.
- Command center component that renders registered commands.
- Event stream component.
- Basic layout persistence service using local storage for the demo.

Rules:

- The platform renders registered data; it does not define brand-specific domain content.
- No HarborLift or TerraGrid imports.
- Platform components can use `white-label-ui`.

Verification:

- `npx ng build dashboard-platform`
- Unit tests for tile registry, edit mode state, add/remove/resize behavior, and command filtering.
- Browser smoke check that a dashboard can render from injected config.

## Phase 4: Neutral White-Label Dashboard

Project: `white-label-dashboard`

Create the default product configuration for the neutral app.

Deliverables:

- `provideWhiteLabelDashboard()` provider function.
- Neutral tenant config.
- Neutral Material 3 theme tokens.
- Neutral navigation.
- Default dashboard layout.
- Generic tile catalog:
  - Fleet overview.
  - Fleet health chart.
  - Telemetry ingest chart.
  - Command latency chart.
  - Machine table.
  - Command center.
  - Event stream.
  - Operating area.
- Generic telemetry streams.
- Generic command definitions:
  - Pause.
  - Resume.
  - Return to base.
  - Restart component.
  - Lock out.

Verification:

- `npx ng build white-label-dashboard`
- Provider test confirming that neutral tiles, telemetry streams, commands, and navigation are registered.

## Phase 5: White-Label App Composition

Project: `white-label-operations-console`

Wire the neutral app to the platform and neutral dashboard config.

Deliverables:

- App bootstrap uses `provideDashboardPlatform()` and `provideWhiteLabelDashboard()`.
- App routes render the platform shell.
- Global styles load the neutral Material 3 theme.
- App title and metadata identify the neutral operations console.

Verification:

- `npx ng build white-label-operations-console`
- Local smoke test with `npx ng serve white-label-operations-console`.
- Confirm edit mode, tile add/remove/resize, charts, command center, and event stream work.

## Phase 6: HarborLift Branded Dashboard

Project: `harborlift-dashboard`

Create the logistics branded dashboard extension.

Deliverables:

- `provideHarborLiftDashboard()` provider function.
- HarborLift tenant config.
- HarborLift theme tokens and terminology.
- Logistics navigation.
- Logistics dashboard layout.
- Logistics tile catalog:
  - Yard status.
  - Dock queue.
  - Container move progress.
  - Charging queue.
  - Blocked path alerts.
  - AMR utilization.
  - Throughput chart.
- Logistics telemetry streams:
  - Dock utilization.
  - Aisle congestion.
  - Route blockage.
  - Charging queue depth.
  - Container move progress.
  - Handoff status.
- Logistics command definitions:
  - Pause mission.
  - Reroute.
  - Return to charger.
  - Set speed limit.
  - Yield.
  - Confirm handoff.

Verification:

- `npx ng build harborlift-dashboard`
- Provider test confirming HarborLift-specific tiles, commands, telemetry, theme, and navigation are registered.
- Confirm HarborLift does not import TerraGrid configuration.

## Phase 7: HarborLift App Composition

Project: `harborlift-robotics`

Wire the HarborLift app to the platform and HarborLift extension.

Deliverables:

- App bootstrap uses `provideDashboardPlatform()` and `provideHarborLiftDashboard()`.
- App routes render the platform shell.
- Global styles load HarborLift theme tokens.
- App title and metadata identify HarborLift Robotics.

Verification:

- `npx ng build harborlift-robotics`
- Local smoke test with `npx ng serve harborlift-robotics`.
- Confirm logistics tiles and commands appear.
- Confirm neutral-only and TerraGrid-only content does not appear.

## Phase 8: TerraGrid Branded Dashboard

Project: `terragrid-dashboard`

Create the field robotics branded dashboard extension.

Deliverables:

- `provideTerraGridDashboard()` provider function.
- TerraGrid tenant config.
- TerraGrid theme tokens and terminology.
- Field operations navigation.
- Field operations dashboard layout.
- Field robotics tile catalog:
  - Field coverage.
  - Route progress.
  - Weather and terrain.
  - Payload status.
  - Hazard markers.
  - Inspection progress.
  - Battery and thermal chart.
- Field telemetry streams:
  - GPS route progress.
  - Field coverage.
  - Weather conditions.
  - Terrain state.
  - Payload state.
  - Hazard markers.
- Field command definitions:
  - Return to base.
  - Pause implement.
  - Adjust route.
  - Reduce speed.
  - Start inspection pass.
  - Mark hazard.

Verification:

- `npx ng build terragrid-dashboard`
- Provider test confirming TerraGrid-specific tiles, commands, telemetry, theme, and navigation are registered.
- Confirm TerraGrid does not import HarborLift configuration.

## Phase 9: TerraGrid App Composition

Project: `terragrid-autonomy`

Wire the TerraGrid app to the platform and TerraGrid extension.

Deliverables:

- App bootstrap uses `provideDashboardPlatform()` and `provideTerraGridDashboard()`.
- App routes render the platform shell.
- Global styles load TerraGrid theme tokens.
- App title and metadata identify TerraGrid Autonomy.

Verification:

- `npx ng build terragrid-autonomy`
- Local smoke test with `npx ng serve terragrid-autonomy`.
- Confirm field tiles and commands appear.
- Confirm neutral-only and HarborLift-only content does not appear.

## Phase 10: Cross-Dashboard Demo Polish

Projects: all frontend projects

Make the demo coherent across all dashboards.

Deliverables:

- Consistent app shell behavior across all three apps.
- Distinct theme, terminology, dashboard layout, tiles, telemetry, and commands per dashboard.
- Shared tile edit mode works identically across all dashboards.
- Chart.js visuals are smooth and compact.
- Responsive layout works on desktop and mobile.
- README files explain each project role.
- Architecture docs match the implemented structure.

Verification:

- Build all libraries:

```bash
npx ng build white-label-ui
npx ng build dashboard-platform
npx ng build white-label-dashboard
npx ng build harborlift-dashboard
npx ng build terragrid-dashboard
```

- Build all apps:

```bash
npx ng build white-label-operations-console
npx ng build harborlift-robotics
npx ng build terragrid-autonomy
```

- Run app smoke checks in the browser.
- Capture screenshots of each dashboard for documentation.

## Suggested Implementation Order

1. `white-label-ui`
2. `dashboard-platform` contracts and provider tokens
3. `dashboard-platform` shell, tile grid, edit mode, Chart.js wrapper, commands
4. `white-label-dashboard`
5. `white-label-operations-console`
6. `harborlift-dashboard`
7. `harborlift-robotics`
8. `terragrid-dashboard`
9. `terragrid-autonomy`
10. Cross-dashboard polish and verification

## Definition of Done

The frontend implementation is done when:

- All three apps build and run independently.
- Each app composes the same platform and a different dashboard configuration library.
- Shared UI components live in `white-label-ui`.
- Shared dashboard behavior lives in `dashboard-platform`.
- Brand-specific features live only in the branded dashboard libraries.
- Tile edit mode works across all dashboards.
- Chart.js telemetry charts render in every dashboard.
- Commands are registered by dashboard configuration and rendered by the shared command UI.
- The white-label, HarborLift, and TerraGrid dashboards are visibly and functionally distinct.
