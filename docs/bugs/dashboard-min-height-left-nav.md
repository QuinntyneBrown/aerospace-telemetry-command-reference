# Bug: Dashboard and Left Navigation Do Not Fill Screen Height

## Summary

The dashboard shell should always fill the viewport at minimum height, and the left side navigation should extend to the bottom of the screen. Current dashboard layout behavior can leave the shell or navigation shorter than the viewport, which makes the application frame feel incomplete on taller screens or sparse dashboard states.

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

## Description

The dashboard should maintain a full-screen application frame. At minimum, the dashboard container should fill the visible viewport, and the left navigation rail should visually extend to the bottom edge of the screen even when the dashboard content is short.

## Steps To Reproduce

1. Start any dashboard app.
2. Open the app in a desktop browser viewport with enough vertical space.
3. Observe the dashboard shell and left side navigation height.
4. Resize the viewport taller or navigate to a state with limited dashboard content.

## Expected Behavior

- The dashboard shell fills at least `100dvh`.
- The main dashboard body fills the remaining height below the top app bar.
- The left side navigation extends to the bottom of the visible screen.
- The behavior is consistent across all three dashboard apps.
- Content can grow beyond the viewport and scroll normally without shrinking the shell.

## Actual Behavior

The dashboard frame and/or left navigation can appear shorter than the viewport, leaving unused background space below the navigation.

## Impact

This is a visual layout defect that makes the reference dashboard feel unfinished and can reduce confidence in the white-label shell. It also weakens consistency across branded dashboard implementations.

## Acceptance Criteria

- Dashboard shell has a minimum height equal to the viewport.
- Dashboard body fills the remaining viewport height below the top app bar.
- Left navigation rail stretches to the bottom of the viewport on desktop.
- Mobile layout remains usable and does not introduce horizontal scrolling.
- The fix applies through shared platform/UI styling, not duplicated app-level overrides.
- Verified in all three apps.

## Notes

Likely fix location is shared layout CSS in `dashboard-shell`, `side-navigation`, or `rail-nav`. Prefer a platform-level fix so every branded app inherits the same behavior.
