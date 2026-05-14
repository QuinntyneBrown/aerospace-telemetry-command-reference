# Bug: Desktop Rail Navigation Is Not Flush With Browser Edge

## Summary

For all dashboard apps on desktop, there should be no space between the left side of the rail navigation and the left edge of the browser window. The rail navigation should be flush with the browser edge, matching the mock implementations.

## Status

Fixed

## Resolved Date

2026-05-14

## Reported Date

2026-05-14

## Severity

Medium

## Area

Frontend dashboard layout

## Affected Applications

- `white-label-operations-console`
- `harborlift-robotics`
- `terragrid-autonomy`

## Affected Components

- `frontend/projects/dashboard-platform/src/lib/components/dashboard-shell/`
- `frontend/projects/dashboard-platform/src/lib/components/side-navigation/`
- `frontend/projects/white-label-ui/src/lib/components/rail-nav/`

## Reference

Mock implementation:

`C:\projects\ninja\docs\skeletons\viam-spacex-dashboard.html`

## Description

The desktop dashboard layout should position the rail navigation directly against the left edge of the browser viewport. Any page padding or shell gutter should begin to the right of the rail navigation, not outside it.

Current layout behavior can leave a visible gap between the browser edge and the rail navigation, which does not match the intended mock layout.

## Steps To Reproduce

1. Start any dashboard app.
2. Open the app in a desktop browser viewport.
3. Inspect the left edge of the dashboard.
4. Compare the rail navigation position against the mock implementation.

## Expected Behavior

- The rail navigation is flush with the left edge of the browser window on desktop.
- There is no visible left gutter before the rail navigation.
- Main dashboard content may retain internal spacing to the right of the rail.
- Behavior is consistent across all three dashboard apps.
- Mobile layout remains responsive and usable.

## Actual Behavior

The rail navigation can appear inset from the left edge of the browser, leaving unintended space between the rail and viewport edge.

## Impact

This is a visual fidelity and layout consistency issue. It makes the reference implementation diverge from the mocks and makes the dashboard shell feel less polished.

## Acceptance Criteria

- Desktop rail navigation starts at `x = 0` relative to the viewport.
- No app-level duplicate fixes are needed; shared layout styles provide the behavior.
- Main content spacing remains visually balanced after the rail is flush-left.
- Fix is verified in:
  - `white-label-operations-console`
  - `harborlift-robotics`
  - `terragrid-autonomy`
- Fix is checked against the mock layout in `docs/skeletons/viam-spacex-dashboard.html`.

## Notes

Likely fix location is shared dashboard shell spacing. Review padding and grid/gap rules around `dashboard-body`, `side-navigation`, and `rail-nav`.
