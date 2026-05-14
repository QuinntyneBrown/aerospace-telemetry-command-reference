# Bug: Dashboard Apps Do Not Consistently Fill Screen Responsively

## Summary

Each dashboard app should take up the full screen on all screen sizes and remain responsive in the same manner as the mock implementation in `docs/skeletons/viam-spacex-dashboard.html`.

## Status

Fixed

## Resolved Date

2026-05-14

## Reported Date

2026-05-14

## Severity

High

## Area

Frontend dashboard layout and responsive behavior

## Affected Applications

- `white-label-operations-console`
- `harborlift-robotics`
- `terragrid-autonomy`

## Affected Components

- `frontend/projects/dashboard-platform/src/lib/components/dashboard-shell/`
- `frontend/projects/dashboard-platform/src/lib/components/tile-grid/`
- `frontend/projects/dashboard-platform/src/lib/components/side-navigation/`
- `frontend/projects/dashboard-platform/src/lib/components/top-app-bar/`
- App-level global styles in each dashboard application

## Reference

Mock implementation:

`C:\projects\ninja\docs\skeletons\viam-spacex-dashboard.html`

## Description

The dashboard applications should behave like full-screen operational tools. The shared app shell, navigation, top bar, and dashboard content area should fill the available viewport at every supported screen size.

The responsive behavior should match the mock implementation, including desktop layout, tablet behavior, and mobile stacking or collapsing behavior where appropriate.

## Steps To Reproduce

1. Start any of the three dashboard apps.
2. Open the dashboard in a desktop viewport.
3. Resize the browser to tablet and mobile widths.
4. Compare the layout behavior against `docs/skeletons/viam-spacex-dashboard.html`.
5. Observe whether the app fills the full screen and remains usable without awkward gaps, clipping, or horizontal overflow.

## Expected Behavior

- Dashboard app fills at least the full viewport height and width.
- Layout remains responsive across desktop, tablet, and mobile viewport sizes.
- Main shell, top bar, side navigation, and tile grid adapt consistently with the mock implementation.
- No unintended whitespace appears below or beside the dashboard shell.
- No horizontal scrolling is introduced on mobile.
- Tiles reflow predictably and remain readable.
- Navigation remains usable at smaller breakpoints.

## Actual Behavior

The dashboard apps do not consistently take up the full screen or match the responsive behavior shown in the mock implementation across all screen sizes.

## Impact

This weakens the quality of the reference implementation. Since this project demonstrates a white-label dashboard shell, inconsistent full-screen and responsive behavior makes the shared platform feel incomplete and may cause every branded dashboard to inherit layout issues.

## Acceptance Criteria

- All three dashboard apps fill the full screen on desktop, tablet, and mobile viewport sizes.
- Responsive layout matches the behavior and intent of `docs/skeletons/viam-spacex-dashboard.html`.
- Shared platform styles drive the behavior rather than duplicated app-specific fixes.
- Side navigation, top bar, and tile grid remain visually coherent at each breakpoint.
- No horizontal overflow occurs at common mobile widths.
- Layout is verified against at least:
  - desktop viewport
  - tablet viewport
  - mobile viewport
- Fix is confirmed in:
  - `white-label-operations-console`
  - `harborlift-robotics`
  - `terragrid-autonomy`

## Notes

This bug is related to the broader dashboard shell layout behavior and may overlap with bugs for minimum screen height, left navigation height, and sticky top bar behavior. The preferred fix should happen in shared platform/UI layout styles so future branded dashboards inherit the same responsive behavior.
