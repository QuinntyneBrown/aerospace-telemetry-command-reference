# Bug: Edit Mode Needs Tile Selection List For Adding Dashboard Tiles

## Summary

When a user clicks Edit on any dashboard, there should be a clear way to select a dashboard tile from a list and add it to the current dashboard. This behavior should work consistently across the neutral, HarborLift, and TerraGrid dashboard apps.

## Status

Fixed

## Resolved Date

2026-05-14

## Reported Date

2026-05-14

## Severity

Medium

## Area

Frontend dashboard edit mode

## Affected Applications

- `white-label-operations-console`
- `harborlift-robotics`
- `terragrid-autonomy`

## Affected Components

- `frontend/projects/dashboard-platform/src/lib/components/tile-grid/`
- `frontend/projects/white-label-ui/src/lib/components/tile-add-form/`
- `frontend/projects/dashboard-platform/src/lib/services/tile-registry.service.ts`

## Description

The dashboard edit experience should expose the registered tile catalog to users. After entering edit mode, users should be able to choose an available tile from a list and add it to the dashboard layout.

The list should be populated from the dashboard-specific tile registry so each app shows only the tiles registered for that dashboard brand/configuration.

## Steps To Reproduce

1. Start any dashboard app.
2. Click the Edit control.
3. Look for a visible list or picker of available dashboard tiles.
4. Try to select a tile and add it to the dashboard.

## Expected Behavior

- Edit mode exposes a tile list, picker, or select control populated from the registered dashboard tile catalog.
- Selecting a tile and confirming add inserts the selected tile into the current dashboard.
- The new tile uses its configured default size.
- The add-tile flow works in all three dashboard apps.
- The available list respects brand-specific tile registration.
- Disabled or feature-flagged-off tiles are not addable.

## Actual Behavior

There is not a sufficiently clear or reliable way to select a dashboard tile from a list and add it to the dashboard after clicking Edit.

## Impact

This limits the usefulness of dashboard edit mode. Users can enter edit mode but cannot confidently discover or add available dashboard tiles, which weakens the white-label dashboard customization story.

## Acceptance Criteria

- Clicking Edit reveals an add-tile control.
- Add-tile control displays available tile names from the active dashboard configuration.
- User can select one tile and add it to the dashboard.
- Added tile appears immediately in the dashboard grid.
- Added tile persists using the shared demo layout persistence behavior.
- Behavior is verified in:
  - `white-label-operations-console`
  - `harborlift-robotics`
  - `terragrid-autonomy`
- Unit tests cover the add flow and edit-mode guard behavior.

## Notes

Likely implementation area is the shared `tile-grid` component and the dumb `tile-add-form` presentation component. Keep the catalog source in `dashboard-platform` via the tile registry token/service so branded dashboards only provide tile definitions and do not duplicate edit-mode logic.
