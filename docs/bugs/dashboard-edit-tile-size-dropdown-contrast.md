# Bug: Tile Size Dropdown Has White Text On White Background In Edit Mode

## Summary

For all dashboard apps, when the dashboard is in edit mode and the user opens the tile size dropdown, the dropdown options render as white text on a white background. The user cannot read the options. The dropdown should use styling aligned with the dashboard mock.

## Status

Fixed

## Resolved Date

2026-05-14

## Reported Date

2026-05-14

## Severity

High

## Area

Frontend edit mode controls and visual styling

## Affected Applications

- `white-label-operations-console`
- `harborlift-robotics`
- `terragrid-autonomy`

## Affected Components

- `frontend/projects/dashboard-platform/src/lib/components/tile-grid/`
- `frontend/projects/white-label-ui/src/lib/components/tile-size-select/`
- `frontend/projects/white-label-ui/src/lib/components/select-field/`

## Reference

Mock implementation:

`C:\projects\ninja\docs\skeletons\viam-spacex-dashboard.html`

## Description

Tile edit controls should remain readable and visually consistent with the dashboard theme. The tile size dropdown currently has insufficient contrast because the option text and option background are both white or near-white.

This affects the resize interaction for dashboard tiles and makes edit mode difficult to use.

## Steps To Reproduce

1. Start any dashboard app.
2. Click Edit.
3. Open the size dropdown on any dashboard tile.
4. Observe the dropdown option text and background.

## Expected Behavior

- Dropdown option text is readable.
- Dropdown background and text colors follow the dashboard theme or mock styling.
- Hover, focus, and selected states remain visible.
- Styling is consistent across all three dashboard apps.
- The control works in desktop and mobile viewports.

## Actual Behavior

The tile size dropdown displays white text on a white background, making the options unreadable.

## Impact

This blocks a core edit-mode workflow. Users cannot confidently resize tiles because they cannot read the available size options.

## Acceptance Criteria

- Tile size dropdown options have accessible contrast.
- Dropdown styling aligns with `docs/skeletons/viam-spacex-dashboard.html`.
- Fix applies through shared UI/platform styling, not duplicated app-specific overrides.
- Hover, focus, disabled, and selected states are readable.
- Verified in:
  - `white-label-operations-console`
  - `harborlift-robotics`
  - `terragrid-autonomy`
- Unit or visual smoke coverage confirms dropdown option text remains visible.

## Notes

Likely fix location is the shared `select-field` or `tile-size-select` styling. If native `<select>` styling is limited across browsers, consider applying explicit foreground/background colors to the select and option elements or replacing the control with a themed custom/menu-based selector.
