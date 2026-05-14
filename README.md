# Aerospace Telemetry Command Reference

Reference implementation for a white-label robotics telemetry and command dashboard.

This project explores how one reusable operations platform can support multiple branded customer dashboards. The base platform receives telemetry from connected robots or machines, displays operational state, and allows authorized users to send commands back to devices.

## Project Concept

The reference app models a company building customer-facing operations software for robotics and aerospace-adjacent systems. The core product is a white-label dashboard that can be themed and extended for different companies without changing the underlying telemetry and command infrastructure.

The planned demo includes:

- A neutral white-label operations console.
- A customized logistics robotics dashboard for **HarborLift Robotics**.
- A customized field robotics dashboard for **TerraGrid Autonomy**.

## Reference Company

The project uses **Viam** as a real-company case-study anchor because its public product direction aligns with robotics infrastructure, telemetry, remote operation, fleet management, and command delivery.

This repository is independent. It is not affiliated with, endorsed by, or sponsored by Viam.

## Documentation

- [Idea brief](./idea.md): polished project concept and product story.
- [Company and dashboard products](./docs/company-and-dashboard-products.md): description of Viam as the reference company and the fictional dashboards planned for the demo.

## Intended Outcome

The goal is to build a polished reference application that shows:

- Telemetry ingestion and display.
- Device and fleet health monitoring.
- Command dispatch and command history.
- Tenant-specific branding.
- Domain-specific dashboard extensions.
- A reusable platform foundation behind multiple customer experiences.

## Status

Early planning and documentation stage.
