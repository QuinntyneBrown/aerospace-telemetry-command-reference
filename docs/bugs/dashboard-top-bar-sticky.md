# Bug: Dashboard Top Bar Is Not Sticky

## Summary

The top bar on every dashboard should remain visible while the user scrolls. Current dashboard behavior allows the top bar to scroll out of view, which removes key brand, product, and status context during longer dashboard sessions.

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
- `frontend/projects/dashboard-platform/src/lib/components/top-app-bar/`

## Description

All dashboard apps use the shared platform shell and top app bar. The top app bar should stay pinned to the top of the viewport as the main dashboard content scrolls, so users retain tenant identity, product context, and system status at all times.

## Steps To Reproduce

1. Start any dashboard app.
2. Open the app in a browser viewport where the dashboard content is taller than the visible screen.
3. Scroll down through the dashboard tiles.
4. Observe whether the top bar remains visible.

## Expected Behavior

- The top app bar remains sticky at the top of the viewport while dashboard content scrolls.
- Sticky behavior is consistent across all three dashboard apps.
- The top bar keeps its visual layering above dashboard tiles and navigation content.
- The top bar does not overlap content in a way that hides tile controls or headings.
- Mobile and desktop layouts both keep the top bar accessible.

## Actual Behavior

The top bar can scroll away with the rest of the dashboard content, leaving no persistent brand, product, or status context visible.

## Impact

This is a usability and layout consistency defect. Operators lose persistent context while reviewing telemetry, command state, or event history, especially on dashboards with many tiles.

## Acceptance Criteria

- Top app bar uses shared platform styling to remain sticky.
- Sticky top bar works in `white-label-operations-console`, `harborlift-robotics`, and `terragrid-autonomy`.
- Top bar has an appropriate z-index and background so content does not bleed through while scrolling.
- Main content scroll behavior remains normal.
- No app-specific duplicated sticky overrides are required.
- Verified at desktop and mobile widths.

## Notes

Likely fix location is shared CSS in `dashboard-shell` or `top-app-bar`. Prefer a platform-level fix so the behavior applies uniformly to every current and future branded dashboard.
