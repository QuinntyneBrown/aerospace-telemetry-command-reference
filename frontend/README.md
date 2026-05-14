# Frontend

Angular reference implementation for a white-label robotics dashboard. The workspace demonstrates one shared dashboard platform composed into three independently branded applications.

## Applications

- `white-label-operations-console`: neutral Viam reference console.
- `harborlift-robotics`: HarborLift logistics robotics dashboard.
- `terragrid-autonomy`: TerraGrid field robotics dashboard.

## Libraries

- `white-label-ui`: dumb presentation components with inputs and outputs only.
- `dashboard-platform`: shared shell, tile grid, edit mode, Chart.js wrapper, telemetry adapter, command dispatch contract, and layout persistence.
- `white-label-dashboard`: neutral tenant configuration, tiles, commands, telemetry streams, navigation, and layout.
- `harborlift-dashboard`: HarborLift brand, logistics terminology, telemetry, commands, tiles, navigation, and layout.
- `terragrid-dashboard`: TerraGrid brand, field robotics terminology, telemetry, commands, tiles, navigation, and layout.

## Commands

```bash
npx ng build white-label-ui
npx ng build dashboard-platform
npx ng build white-label-dashboard
npx ng build harborlift-dashboard
npx ng build terragrid-dashboard
npx ng build white-label-operations-console
npx ng build harborlift-robotics
npx ng build terragrid-autonomy
```

Serve an app with:

```bash
npx ng serve white-label-operations-console
```
