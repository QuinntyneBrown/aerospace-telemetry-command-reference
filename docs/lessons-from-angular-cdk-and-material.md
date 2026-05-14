# Lessons from Angular CDK and Angular Material

## Purpose

This project ships one white-label dashboard platform and several branded dashboards built on top of it. Angular CDK and Angular Material solve a very similar problem at the component-library level: the CDK is the unbranded, behaviour-only foundation, and Material is one specific branded skin built on top of it. Looking at how that split is structured gives us a concrete template for our own white-label library (`white-label-ui`, `dashboard-platform`) and for the branded libraries (`harborlift-dashboard`, `terragrid-dashboard`).

The goal of this document is not to copy Angular Material. It is to extract the patterns that matter for delivering a reusable, brandable platform without ending up with either a rigid "one-look-only" library or an unmaintainable pile of brand forks.

## The Core Idea: Behaviour and Look Are Separate Products

The single most important lesson is that Angular split their library in two:

- **Angular CDK** ships behaviours, primitives, and accessibility wiring. It has almost no visual opinion. It owns things like overlays, focus traps, drag and drop, virtual scrolling, table data sources, stepper state, listbox keyboard handling, and ARIA semantics.
- **Angular Material** is one branded implementation of those behaviours, following the Material Design spec. It owns colours, typography, spacing, motion, and the specific markup that produces the Material look.

For our project this maps to:

- `white-label-ui` and `dashboard-platform` should behave like the CDK. They own behaviours, primitives, layout shells, data tables, alert lists, command panels, and accessibility semantics. They should be visually neutral and never bake in Harborlift or Terragrid choices.
- `harborlift-dashboard` and `terragrid-dashboard` should behave like Material. They are one specific brand on top of the neutral primitives. They own colour, typography, iconography, illustration, voice, and any brand-specific component variants.

If a developer cannot answer the question "is this behaviour or look?" for a given piece of code, it probably belongs in the wrong library.

## Lessons for the White-Label Library

### 1. Headless primitives over styled components

CDK components like `cdk-overlay`, `cdk-portal`, `cdk-tree`, `cdk-stepper`, `cdk-listbox`, and `cdk-virtual-scroll-viewport` provide structure and behaviour but ship with essentially no styling. Brands (Material, or any third party) wrap them and apply their own look.

For us this means `white-label-ui` should expose primitives such as a fleet table, a telemetry stream viewport, a command confirmation overlay, and an alert list as headless or near-headless components. They should accept content projection and templates so that brands can change the visual presentation without forking the behaviour.

### 2. Accessibility is the platform's job, not the brand's

The CDK's `a11y` package centralises focus management, live announcements, focus traps, and keyboard navigation. Material then inherits correct accessibility "for free" because the CDK already handled it.

The same rule should apply here. Keyboard navigation in the fleet table, focus management in the command confirmation dialog, ARIA roles in the alert list, and live region announcements for telemetry status changes belong in `white-label-ui` or `dashboard-platform`. Brands must not be allowed to re-implement these, because each fork is a chance to break accessibility.

### 3. Design tokens, not hard-coded styles

Angular Material exposes its visual system through Sass mixins and, more recently, CSS custom properties driven by an M3 token system. A consumer chooses a palette, typography config, and density, and Material renders itself accordingly. The components do not hard-code colours.

The white-label library should do the same. Define a token layer (CSS custom properties or Sass functions) for things like surface colour, primary action colour, danger colour, font family, font scale, spacing scale, border radius, elevation, and motion timing. Components in `white-label-ui` should only read tokens. Brands provide values.

### 4. Theming as a public, documented API

Material's theming API (palettes, typography configs, density) is treated as a first-class part of the library, with its own documentation and migration guides. It is not an afterthought.

We should treat the brand-customisation surface the same way. The set of tokens, slots, and extension points exposed by `white-label-ui` and `dashboard-platform` is a public API. Adding, removing, or renaming a token is a breaking change. Brands should be able to read one document and know exactly what they can change.

### 5. Schematics and a CLI story for adoption

Material ships `ng add @angular/material` and component schematics that scaffold the wiring. This dramatically lowers the cost of starting a new app or adding a feature.

For this project, schematics that scaffold a new branded dashboard (palette file, brand module, route registration, sample brand component) would carry a lot of weight. They keep brands consistent and prevent each new brand from inventing its own structure.

### 6. Strict, narrow public API surface

Angular CDK and Material use Angular Package Format and clear `public-api` barrels. Internals are explicitly internal. This is what lets them refactor aggressively without breaking consumers.

The white-label libraries need the same discipline: a single `public-api.ts` per library, no deep imports allowed, internal helpers kept out of the barrel. Without this, brands will reach into internals and the platform will become impossible to evolve.

### 7. Test harnesses for behaviour

Material provides component test harnesses (`@angular/cdk/testing`) so consumers can test against stable behavioural APIs instead of DOM structure. This is what allows Material to change its DOM without breaking everyone's tests.

If we expect brands to write tests against platform components (fleet table filtering, command confirmation, alert acknowledgement), shipping harnesses for those components prevents brand tests from coupling to the white-label DOM.

## Lessons for Branded Libraries

### 1. A brand is configuration plus a thin extension layer

Material is, in large part, a thick wrapper that picks one set of token values and one set of visual decisions. Most of the heavy lifting still lives in the CDK. A brand library should look the same: mostly a theme file, some component variants, and a small amount of brand-specific composition. If a brand library starts re-implementing tables, overlays, or keyboard handling, that is a smell that the white-label layer is missing something.

### 2. Brands extend, they don't fork

Material adds Material-specific components (`mat-card`, `mat-chip`) that have no CDK counterpart, but it does not fork the CDK overlay to make a "Material overlay." It uses the CDK overlay and styles it.

`harborlift-dashboard` and `terragrid-dashboard` should follow the same rule. New brand-specific components are fine. Forking a white-label component to tweak its behaviour is not. If a behaviour change is needed, it is a feature request against the white-label library, usually expressed as a new input, slot, or token.

### 3. One brand should never see another brand

Material does not depend on any other brand. Likewise, `harborlift-dashboard` must not import from `terragrid-dashboard` and vice versa. Both depend only on `white-label-ui` and `dashboard-platform`. This keeps brands genuinely interchangeable and prevents accidental cross-brand coupling.

### 4. Keep brand voice and content in the brand

Material owns its own copy ("OK", "Cancel" defaults, ARIA labels in English) but allows overrides through `MAT_*_DEFAULT_OPTIONS` and i18n. Brand-specific tone, terminology ("fleet" vs "swarm" vs "deployment"), and iconography should live in the brand library, with the white-label library exposing the slots and tokens needed to inject them.

## Anti-Patterns to Avoid

These are mistakes that Angular CDK and Material have explicitly worked to avoid, and that this project should also avoid.

- **Brand colours leaking into the platform.** No hex codes, no brand names, no brand-specific asset paths in `white-label-ui` or `dashboard-platform`.
- **Behaviour leaking out of the platform.** No keyboard handlers, focus management, or ARIA wiring re-implemented inside a brand library.
- **A single "god theme" with `if brand === 'harborlift'` branches.** Branding is delivered by providing token values and brand modules, not by conditional logic inside platform components.
- **Deep imports across library boundaries.** All consumption goes through each library's `public-api`.
- **One brand depending on another.** Brands depend only on the white-label layer.
- **Treating theming as styling done at the end.** The token system and theming API are designed up front, alongside the components, the same way Material designs its theming API alongside each component.

## How This Maps to Our Repository

Using the structure described in `docs/angular-project-architecture.md`:

- `white-label-ui` plays the role of Angular CDK plus the unstyled half of Angular Material: headless and lightly styled primitives, accessibility, design tokens.
- `dashboard-platform` plays the role of higher-level Material modules that coordinate primitives into product-shaped features (shell, navigation, telemetry stream, command pipeline) while staying brand-neutral.
- `white-label-dashboard` plays the role of a default Material theme: a neutral, ready-to-run configuration of the platform.
- `harborlift-dashboard` and `terragrid-dashboard` play the role of "another team's branded design system built on Material": their own tokens, their own brand-specific components, their own copy, but no forks of platform behaviour.

If each library stays in its lane, adding a third brand later should be cheap, and changing the platform should not require touching any brand code beyond updating token values.

## Summary

The Angular CDK and Angular Material split works because it is enforced, not aspirational. Behaviour and accessibility live in one place, look and brand live in another, and the boundary between them is a real, documented, versioned API surface. The same discipline, applied to `white-label-ui`, `dashboard-platform`, and the branded dashboard libraries, is what will let this project credibly demonstrate a white-label platform with multiple branded dashboards built on top of it.
