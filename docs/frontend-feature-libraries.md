# Frontend Feature Libraries

## Purpose

This document describes how to split the Angular frontend into **feature libraries** and how every feature should ship as **two cooperating packages**:

- A neutral **white-label feature package**.
- A **brandable feature extension package** that customers (HarborLift, TerraGrid, future tenants) can adopt and extend without forking the white-label code.

The goal is to keep the apps thin, the platform stable, and to give every feature the same predictable shape so that adding a new branded dashboard is a configuration exercise, not a fork.

This document complements:

- `angular-project-architecture.md` — overall workspace shape.
- `frontend-implementation-plan.md` — implementation principles.
- `company-and-dashboard-products.md` — product context for the white-label and branded dashboards.

## Why Split Into Feature Libraries

The current `dashboard-platform` library is a single bucket that mixes the dashboard shell, fleet overview, telemetry, command center, alerts, fleet map, and device detail behavior. Every brand-specific change risks touching the same shared library.

Splitting by feature gives the project clear seams:

- Each feature owns its own contracts, components, services, providers, and tile definitions.
- The shared platform shrinks back to true cross-feature primitives (shell, tile grid, theming, provider tokens).
- Branded packages extend one feature without recompiling unrelated features.
- Teams can move on different features in parallel without merge contention.
- Customer brands can opt in to features, replace tiles, or swap entire feature implementations through providers.

## Feature Catalog

The white-label operations console exposes the following features. Each feature becomes its own pair of libraries.

| Feature | White-label package | Brandable extension package |
| --- | --- | --- |
| Dashboard shell and navigation | `feature-shell` | `feature-shell-brand` |
| Fleet overview | `feature-fleet-overview` | `feature-fleet-overview-brand` |
| Telemetry stream | `feature-telemetry` | `feature-telemetry-brand` |
| Device detail panel | `feature-device-detail` | `feature-device-detail-brand` |
| Command center | `feature-command-center` | `feature-command-center-brand` |
| Fleet map / operating area | `feature-fleet-map` | `feature-fleet-map-brand` |
| Alerts and event history | `feature-alerts` | `feature-alerts-brand` |
| Tenant configuration and theming | `feature-tenant` | `feature-tenant-brand` |

Brand integrations (HarborLift, TerraGrid) consume the brandable extension package, never the white-label package directly when they need to override behavior.

## The Two-Package Pattern

Every feature ships as two libraries that live side by side under `frontend/projects`.

### White-Label Package

The white-label package is the neutral, reusable implementation of the feature. It is the package that the white-label operations console uses unchanged.

It should contain:

- Public contracts and interfaces for the feature (tile definitions, command shapes, telemetry stream definitions, view models).
- Default white-label components (smart components and presentation components specific to the feature).
- Default white-label services that implement the feature's contracts.
- Default tile, command, and telemetry definitions for the neutral product.
- A `provideXxxFeature()` function that registers the feature's defaults with the platform.
- Injection tokens for every extension point the feature exposes.

It must not contain:

- Brand identifiers, brand colors, brand copy, or brand-specific business rules.
- Imports from any brand package.
- Imports from any other feature package — features compose through `dashboard-platform` contracts only.

### Brandable Extension Package

The brandable extension package is the surface that customer brands extend. It does not replace the white-label package; it builds on it.

It should contain:

- Re-exports of the feature's public contracts, tokens, and provider helpers from the white-label package.
- A `provideXxxFeatureExtensions()` builder that takes a typed brand configuration and returns providers that override or extend the defaults.
- Lightweight extension hooks: brand component slots, brand tile overrides, brand command transformers, brand telemetry adapters, brand label and copy maps.
- Type definitions for the brand configuration object the feature accepts.

It should not contain:

- Any single brand's data, copy, theme tokens, or workflows. HarborLift and TerraGrid concrete values still live inside their own dashboard libraries.
- Direct imports from `harborlift-dashboard` or `terragrid-dashboard`. Direction of dependency is brand → extension package, never the reverse.

The brandable extension package is what makes the feature *extendable* without forking. Brand libraries call its `provide…Extensions()` helper with their own configuration object.

## Library Shape

Each feature library follows the same internal shape so contributors can navigate them without learning each one separately.

```text
frontend/projects/<feature-name>/
  ng-package.json
  package.json
  tsconfig.lib.json
  tsconfig.lib.prod.json
  tsconfig.spec.json
  src/
    public-api.ts
    lib/
      contracts/        # interfaces, types, injection tokens
      components/       # one folder per component
      services/         # default white-label services
      providers/        # provideXxxFeature() and helpers
      defaults/         # default tile, command, telemetry catalogs
      models/           # view models
      helpers/          # pure functions
```

The brandable extension package mirrors the same shape but is much thinner.

```text
frontend/projects/<feature-name>-brand/
  src/
    public-api.ts
    lib/
      config/           # BrandFeatureConfig type
      providers/        # provideXxxFeatureExtensions(config)
      hooks/            # extension hook contracts
      adapters/         # default adapters that translate brand config into provider values
```

## Naming Convention

- White-label feature: `feature-<feature-name>` (for example `feature-fleet-overview`).
- Brandable extension: `feature-<feature-name>-brand` (for example `feature-fleet-overview-brand`).
- Brand-specific consumer: existing dashboard libraries such as `harborlift-dashboard` and `terragrid-dashboard`.
- Provider functions: `provide<Feature>Feature()` and `provide<Feature>FeatureExtensions(config)`.
- Injection tokens: `<FEATURE>_<EXTENSION_POINT>` (for example `FLEET_OVERVIEW_TILES`, `COMMAND_CENTER_COMMANDS`).
- Selectors continue to use the `viam` prefix for libraries.

## Public API Rules

Every feature library exposes a flat public API through `public-api.ts`.

Exported from a white-label feature package:

- The `provide<Feature>Feature()` function.
- All injection tokens for the feature's extension points.
- The contract interfaces and types brand packages need to implement.
- Public components that other features or apps may compose. Internal components are not exported.

Exported from a brandable extension package:

- The `provide<Feature>FeatureExtensions(config)` function.
- The brand configuration type for that feature.
- The extension hook contracts.
- Re-exported tokens and contracts from the white-label package, so brand libraries only need to import the brand package.

Nothing else should leak. Internal services, internal components, and defaults stay inside `lib/` and are not re-exported.

## Dependency Rules

Dependencies must remain one-way.

```text
applications
  -> brand dashboard libraries (harborlift-dashboard, terragrid-dashboard, white-label-dashboard)
  -> brandable feature extension packages (feature-*-brand)
  -> white-label feature packages (feature-*)
  -> dashboard-platform
  -> white-label-ui
```

Allowed:

- A branded app imports its brand dashboard library and `dashboard-platform`.
- A brand dashboard library imports any `feature-*-brand` package it needs.
- A `feature-*-brand` package imports its matching `feature-*` package and `dashboard-platform`.
- A `feature-*` package imports `dashboard-platform` and `white-label-ui`.
- The white-label app may import `feature-*` packages directly when no brand extension is needed.

Not allowed:

- A `feature-*` package imports a `feature-*-brand` package.
- A `feature-*` package imports another `feature-*` package. Cross-feature collaboration must go through contracts in `dashboard-platform`.
- Any feature package imports a brand dashboard library.
- A brand dashboard library imports a `feature-*` package directly when a `feature-*-brand` package exists for it.
- `dashboard-platform` imports any feature package.
- `white-label-ui` imports any feature package or `dashboard-platform`.

## Extension Points

Each white-label feature package must expose its extension points through injection tokens registered by the platform. The brandable extension package translates a brand configuration into providers for those tokens.

Common extension point categories:

- **Catalog tokens**: tiles, commands, telemetry streams, alert rules, navigation entries. Multi-provider arrays so brands can append items.
- **Override tokens**: default tile component, default command renderer, default telemetry chart. Single-value providers so brands can swap a default.
- **Label tokens**: terminology and copy maps so brands can rename "Robot" to "AMR" or "Field unit".
- **Theme tokens**: feature-scoped CSS variables and Material 3 token overrides.
- **Behavior tokens**: command authorization rules, telemetry decimation strategies, alert severity mappers.

Brands configure these by passing a typed configuration object into the feature's extension provider. The brandable extension package validates the configuration and returns the resulting providers.

## Composition Rules for Brand Libraries

Brand dashboard libraries (`harborlift-dashboard`, `terragrid-dashboard`) become small composition layers.

For each feature a brand wants to extend, the brand library:

1. Imports the matching `feature-<feature-name>-brand` package.
2. Defines a typed brand configuration object that lists tile additions, command additions, telemetry definitions, label overrides, theme tokens, and any hooks.
3. Calls `provide<Feature>FeatureExtensions(config)` and includes the result in the brand's `provide<Brand>Dashboard()` function.

For features the brand does not need to customize, the brand library does not import the brand extension package. The white-label feature package's `provide<Feature>Feature()` is enough on its own.

## App Composition

App bootstraps stay small. The app calls `provideDashboardPlatform()`, then the brand's combined provider, then any app-only providers.

The brand combined provider is responsible for wiring the white-label feature defaults and the brand extensions in the right order. The expected order is:

1. `provideDashboardPlatform()` — shell, tile grid, provider tokens.
2. `provide<Feature>Feature()` for every feature in the product.
3. `provide<Feature>FeatureExtensions(brandConfig)` for every feature the brand customizes.
4. Any brand-only providers that are not part of a feature (for example tenant identity, auth client configuration).

This ordering guarantees that brand overrides and additions are applied on top of the white-label defaults, not the other way around.

## Tile, Command, and Telemetry Registration

Each feature owns its own catalog token. Brand libraries should never push entries into another feature's catalog directly. Instead they add entries through the feature's extension package.

For example, a HarborLift "Reroute" command is registered through `provideCommandCenterFeatureExtensions({ commands: [reroute] })` in `harborlift-dashboard`, which contributes to `COMMAND_CENTER_COMMANDS`. The command center feature does not need to know HarborLift exists.

The same rule applies to telemetry streams, alerts, navigation entries, and dashboard tiles.

## Theming and Branding

Theming uses Material 3 tokens and CSS variables. The two-package pattern applies:

- `feature-tenant` defines the white-label theme tokens, default palette, and CSS variable contract.
- `feature-tenant-brand` accepts a typed brand theme configuration and produces the providers that override the tokens and CSS variables for that brand.
- Brand dashboard libraries pass HarborLift or TerraGrid theme values through the brand extension package, never by editing the white-label feature package.

A feature must not hardcode brand colors, brand copy, or brand iconography. All brand-visible values must come from the tenant feature or the feature's own label and theme tokens.

## Testing Requirements

Each feature library is independently testable.

- White-label feature packages must include unit tests for their contracts, default components, and provider function. Tests must run against the white-label defaults only — no brand fixtures.
- Brandable extension packages must include unit tests for their `provide…Extensions()` helper using a representative brand fixture that lives in the test, not in the package source.
- Brand dashboard libraries (`harborlift-dashboard`, `terragrid-dashboard`) must include integration tests that combine `provide<Feature>Feature()` and `provide<Feature>FeatureExtensions(config)` to confirm the brand overrides take effect.
- Apps should only contain smoke tests that confirm the bootstrap composition runs.

## When to Split a Feature

Use this pattern when a feature meets at least two of the following:

- It owns dedicated tiles, commands, telemetry, or alerts.
- Brands are likely to add or replace items in its catalogs.
- It has its own routes or workflows.
- It changes independently of the dashboard shell.

If a piece of behavior does not meet these criteria, leave it in `dashboard-platform` as shared infrastructure. Do not create a feature library just to move code.

## When to Skip the Brandable Extension Package

The brandable extension package is required only when a feature has at least one extension point that brands realistically need. If a feature is purely structural and has no brand-visible behavior, the white-label feature package alone is enough. The brand extension package can be added later without breaking the white-label feature package, because the white-label package owns the public contracts and tokens.

## Migration Outline

The split should be done feature by feature, leaving the workspace in a working state after each step.

1. Pick one feature with the clearest seam (for example fleet overview).
2. Create `feature-fleet-overview` and move the relevant contracts, components, services, defaults, and providers out of `dashboard-platform`.
3. Update `dashboard-platform/public-api.ts` to no longer export the moved symbols.
4. Update `white-label-dashboard`, `harborlift-dashboard`, and `terragrid-dashboard` to import from the new feature library.
5. Create `feature-fleet-overview-brand`, move any brand extension hooks into it, and have brand libraries call its `provide…Extensions()` helper.
6. Run the white-label app and both branded apps. They must build, serve, and behave identically to the pre-split state.
7. Repeat for the next feature.

Do not split all features in a single change. Each feature split is its own pull request so reviewers can verify behavior is unchanged.

## Success Criteria

The feature library split is successful when:

- Every feature has a white-label package and, where useful, a brandable extension package.
- `dashboard-platform` only contains shell, tile grid, provider tokens, and cross-feature primitives.
- Brand dashboard libraries are thin composition layers built from feature extension packages.
- Adding a new brand requires creating one app, one brand dashboard library, and a typed brand configuration per feature — no changes to white-label feature packages.
- A feature can be replaced or rewritten without touching unrelated features.
- Branded behavior is always discoverable through the brand dashboard library and the brand configuration objects it passes to feature extension packages.
