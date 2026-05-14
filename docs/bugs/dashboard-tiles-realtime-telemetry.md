# Bug: Dashboard Tiles Do Not All Display Real-Time Telemetry

## Summary

For all dashboard apps, every tile should display real-time telemetry specific to that tile when the backend is running. Numeric values should update over time, and smooth line charts should visibly move as new telemetry samples arrive.

## Status

Fixed

## Resolved Date

2026-05-14

## Reported Date

2026-05-14

## Severity

High

## Area

Frontend telemetry integration and dashboard data binding

## Affected Applications

- `white-label-operations-console`
- `harborlift-robotics`
- `terragrid-autonomy`

## Affected Components

- `frontend/projects/dashboard-platform/src/lib/components/metric-summary-tile/`
- `frontend/projects/dashboard-platform/src/lib/components/telemetry-chart-tile/`
- `frontend/projects/dashboard-platform/src/lib/components/telemetry-stream-tile/`
- `frontend/projects/dashboard-platform/src/lib/components/machine-table-tile/`
- `frontend/projects/dashboard-platform/src/lib/services/backend-telemetry-stream.service.ts`
- Dashboard provider libraries that define tile metadata and telemetry stream mappings

## Backend Dependency

Backend must be running and publishing telemetry.

## Description

The dashboard should behave like a live operations console. Every tile should consume telemetry from the backend or a backend-backed stream adapter and render changing data that matches the tile purpose.

Static demo values are acceptable for fallback-only demo mode, but when the backend is running the visible tile data should reflect live telemetry.

## Steps To Reproduce

1. Start the backend.
2. Start any dashboard app.
3. Observe each dashboard tile for at least 30 seconds.
4. Check numeric metric tiles, machine tables, telemetry/event streams, and line charts.
5. Repeat for all three dashboard apps.

## Expected Behavior

- Every tile is connected to telemetry relevant to that tile.
- Metric values change over time when new telemetry arrives.
- Smooth line charts update or move as new samples arrive.
- Machine table values update when machine telemetry changes.
- Event or telemetry stream tiles show live samples/events.
- Tile data is specific to the active dashboard brand and tile purpose.
- Behavior works in all three dashboard apps when the backend is running.

## Actual Behavior

Some tiles can display static metadata or demo values instead of backend-driven real-time telemetry. Numeric values may not change, and line charts may remain static.

## Impact

This is a core product behavior issue. The reference implementation is intended to demonstrate a telemetry and command dashboard, so static or non-moving tiles undermine the real-time dashboard story and make branded dashboards appear incomplete.

## Acceptance Criteria

- Backend-running mode is detected or configured for all dashboard apps.
- All visible tiles bind to backend telemetry or backend-backed stream services.
- Numeric tiles update over time.
- Smooth line charts append or shift data as samples arrive.
- Tile data is mapped to the correct telemetry streams for:
  - neutral reference dashboard
  - HarborLift logistics dashboard
  - TerraGrid field robotics dashboard
- No tile remains static unless explicitly marked as configuration-only or empty-state.
- Unit tests cover telemetry mapping for tile-specific stream ids.
- Browser smoke test confirms visible changing values or moving charts in all three apps.

## Notes

Likely implementation areas include the platform telemetry stream abstraction, backend telemetry stream service, tile metadata stream mappings, and the chart wrapper update behavior. Prefer interface-driven service consumption so demo telemetry and backend telemetry remain swappable through provider configuration.
