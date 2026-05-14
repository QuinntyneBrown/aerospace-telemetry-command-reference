# Bug: Tile Size Selector Does Not Show Current Tile Size

## Summary

For all dashboard apps, when the dashboard is in edit mode, the tile size selector should show the current size of the tile as the selected value. Currently, the selector always displays `mini`, regardless of the tile's actual size.

## Status

Open

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
- `frontend/projects/white-label-ui/src/lib/components/tile-size-select/`
- `frontend/projects/white-label-ui/src/lib/components/select-field/`

## Description

Each tile placement has a configured size, such as `small`, `medium`, `large`, `wide`, or `full`. When edit mode is enabled, the tile size selector should reflect that placement's current size.

Instead, the selector appears to always display `mini`, which makes it look like every tile has the same size and can cause users to accidentally resize tiles incorrectly.

## Steps To Reproduce

1. Start any dashboard app.
2. Click Edit.
3. Look at the size selector on tiles with different configured sizes.
4. Compare the selector value with the tile's actual rendered size or placement configuration.

## Expected Behavior

- Each tile size selector displays the tile placement's current size.
- A `wide` tile shows `wide`.
- A `medium` tile shows `medium`.
- A `small` tile shows `small`.
- Changing the selector updates the tile size.
- Re-entering edit mode continues to show the persisted current size.

## Actual Behavior

The size selector always shows `mini`, even when the tile is not currently configured as `mini`.

## Impact

This creates a misleading edit experience and makes tile resizing unreliable from the user's perspective. It also weakens confidence in layout persistence because the control does not reflect the current dashboard state.

## Acceptance Criteria

- Size selector selected value is bound to each tile placement's current `size`.
- Initial edit-mode render shows the correct size for every visible tile.
- After resizing a tile, the selector immediately reflects the new size.
- After layout persistence reloads, the selector reflects the persisted size.
- Behavior is verified in:
  - `white-label-operations-console`
  - `harborlift-robotics`
  - `terragrid-autonomy`
- Unit tests cover initial selected value and resize updates.

## Notes

Likely fix location is the binding between `tile-grid` and `tile-size-select`, or the internal selected-value handling in `select-field`. Confirm that the shared select component respects its `value` input and does not fall back to the first option.
