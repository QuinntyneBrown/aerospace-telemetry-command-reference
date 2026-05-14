# White-Label Robotics Telemetry and Command Dashboard

## Concept

Build a reference application for a company that provides a white-label robotics operations dashboard. The product receives telemetry from connected robots and IoT-enabled robotic devices, displays fleet health and operational state, and allows authorized users to send commands back to devices.

The reference app should show three versions of the same platform:

1. A neutral, white-label base product.
2. A customized version for a hypothetical logistics robotics company.
3. A customized version for a hypothetical field robotics company.

The goal is to demonstrate how one underlying platform can be branded, themed, and extended for different customers without changing the core telemetry and command infrastructure.

## Mock Case Study Anchor

Use one real company from the research as a public reference point for the type of platform being modeled.

Chosen company: **Viam**

Viam is a strong fit because it publicly describes capabilities around remote robot control, telemetry/data collection, fleet operations, browser-based teleoperation, and white-label robotics experiences.

This should be treated as an inspiration and mock case study only. The app should not imply endorsement, partnership, or official use of Viam branding.

## Product Story

Many robotics companies can build useful robots, but they still need customer-facing operations software: dashboards, command panels, telemetry streams, fleet health views, alerts, audit logs, and branded portals. Building that infrastructure from scratch slows down commercialization.

This product gives robotics companies a ready-made operations layer that can be launched under their own brand. Customers see the robotics company's name, colors, terminology, workflows, and domain-specific tools, while the underlying platform handles the hard shared problems: secure device connectivity, telemetry ingestion, command delivery, role-based access, event history, and fleet monitoring.

## Base White-Label Product

The base version should feel like a clean robotics operations console. It should include:

- Fleet overview with online/offline status.
- Live telemetry stream for robot health, position, battery, temperature, mission state, and alerts.
- Command center for sending approved commands to selected robots.
- Fleet map or spatial view showing active devices.
- Robot detail panel with current status and recent events.
- Tenant theming for logo, colors, labels, and terminology.
- Role-aware command controls and command audit history.
- API/webhook positioning for integrations.

The base product should be generic enough that multiple robotics companies could adopt it without it feeling tied to one industry.

## Customized Version 1: Logistics Robotics Company

Hypothetical customer: **HarborLift Robotics**

HarborLift Robotics operates autonomous mobile robots in ports, container yards, warehouses, and logistics hubs.

The customized dashboard should extend the base product with logistics-specific views and commands:

- Yard or warehouse fleet map.
- Container move progress.
- Dock, berth, aisle, or zone status.
- Traffic congestion and blocked-path alerts.
- Battery and charging queue visibility.
- Commands such as pause mission, reroute, return to charger, yield to human operator, set speed limit, and confirm handoff.

The visual theme should feel industrial, precise, and operational, with a focus on throughput, safety, and uptime.

## Customized Version 2: Field Robotics Company

Hypothetical customer: **TerraGrid Autonomy**

TerraGrid Autonomy operates outdoor field robots for agriculture, land management, and infrastructure inspection.

The customized dashboard should extend the base product with field-operations features:

- Field or site coverage map.
- GPS position and route progress.
- Terrain, weather, or soil-condition telemetry.
- Implement or payload status.
- Coverage percentage and task completion.
- Commands such as return to base, pause implement, adjust route, reduce speed, start inspection pass, and mark hazard.

The visual theme should feel rugged, clear, and field-ready, with emphasis on coverage, reliability, and remote supervision.

## Key Demo Message

The same platform can serve very different robotics businesses:

- The base product provides secure telemetry, command delivery, and fleet visibility.
- Branding makes the product feel owned by the customer.
- Domain extensions make each version feel purpose-built.
- The underlying architecture remains reusable across customers.

## Suggested Reference App Structure

- Tenant switcher to move between the base version and the two customized versions.
- Shared dashboard layout across all tenants.
- Tenant-specific branding, labels, metrics, command options, and extension panels.
- Simulated live telemetry updates.
- Simulated command sending with status changes and audit trail entries.
- A short in-app case study section explaining the Viam-inspired platform pattern.

## Success Criteria

The finished reference app should make it obvious that this is not just a color-swapped dashboard. Each branded version should inherit the same core platform while adding industry-specific workflows, terminology, and operational data.

The app should be polished enough to use in a portfolio, sales prototype, or product strategy discussion.
