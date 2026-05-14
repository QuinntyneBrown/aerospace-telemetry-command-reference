# Company and Dashboard Products

## Reference Company: Viam

Viam is the real company being used as the reference point for this project. The reference application is inspired by the type of robotics infrastructure Viam publicly describes: connecting machines, collecting telemetry, managing fleets, remotely operating robots, and sending commands to devices.

For this project, Viam should be treated as a case-study anchor, not as the owner of the application. The dashboards will be fictional and should not use Viam branding, imply partnership, or present themselves as official Viam products.

## What We Are Building

The project will create a reference implementation of a white-label telemetry and command dashboard for robotics and aerospace-adjacent operations.

The core product is a reusable operations console that can:

- Receive telemetry from robots or connected machines.
- Show fleet health, device status, location, mission state, and alerts.
- Send approved commands back to selected devices.
- Track command history and operational events.
- Support customer-specific branding, language, workflows, and extensions.

The main demo should show one base platform and two fictional customer dashboards built from that same platform.

## Base Product: White-Label Operations Console

The base product is the neutral version of the dashboard. It represents the reusable platform before a customer applies branding or domain-specific workflows.

This version should include:

- Fleet overview.
- Telemetry stream.
- Device detail panel.
- Command center.
- Fleet map or operating-area view.
- Alert and event history.
- Tenant configuration for branding and feature extensions.

The base product should feel like infrastructure: clear, professional, and adaptable.

## Fictional Dashboard 1: HarborLift Robotics

**Customer type:** logistics robotics company  
**Operating environment:** ports, container yards, warehouses, and logistics hubs  
**Dashboard focus:** autonomous mobile robot operations and material movement

HarborLift Robotics uses the platform to monitor and command autonomous mobile robots moving containers, pallets, or equipment through structured logistics environments.

The HarborLift dashboard should emphasize:

- Yard, dock, aisle, or warehouse-zone status.
- Robot availability and charging queues.
- Mission progress for container or pallet movement.
- Blocked route, congestion, and safety alerts.
- Commands such as pause mission, reroute, return to charger, set speed limit, yield, and confirm handoff.

The dashboard should feel industrial, precise, and operations-focused.

## Fictional Dashboard 2: TerraGrid Autonomy

**Customer type:** field robotics company  
**Operating environment:** farms, remote sites, land management areas, and infrastructure corridors  
**Dashboard focus:** outdoor robotic coverage, inspection, and remote supervision

TerraGrid Autonomy uses the platform to monitor and command outdoor robots performing inspection, mapping, agriculture, or land-management tasks.

The TerraGrid dashboard should emphasize:

- GPS position and route progress.
- Field, route, or inspection coverage.
- Terrain, weather, or soil-condition telemetry.
- Payload or implement status.
- Hazard marking and remote supervision.
- Commands such as return to base, pause implement, adjust route, reduce speed, start inspection pass, and mark hazard.

The dashboard should feel rugged, clear, and suitable for remote field operations.

## Demo Intent

The important point is that HarborLift and TerraGrid should not look like simple theme swaps. They should share the same underlying telemetry and command platform, but each should include domain-specific terminology, metrics, commands, and workflows.

This makes the reference implementation useful as a product strategy artifact: it demonstrates how a Viam-inspired platform pattern could support multiple branded customer experiences from one reusable foundation.
