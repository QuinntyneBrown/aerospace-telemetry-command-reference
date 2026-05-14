import { type Provider } from '@angular/core';
import {
  COMMAND_DEFINITIONS,
  CommandCenterTileComponent,
  DASHBOARD_LAYOUT,
  DASHBOARD_TILES,
  EventStreamTileComponent,
  MachineTableTileComponent,
  MetricSummaryTileComponent,
  NAVIGATION_ITEMS,
  OperatingAreaTileComponent,
  TELEMETRY_STREAMS,
  TENANT_CONFIG,
  TelemetryChartTileComponent,
  type BrandTheme,
  type CommandDefinition,
  type DashboardEvent,
  type DashboardLayout,
  type DashboardTileDefinition,
  type NavigationItem,
  type TelemetryStreamDefinition,
  type TenantConfig,
} from 'dashboard-platform';

const theme: BrandTheme = {
  id: 'harborlift-logistics',
  name: 'HarborLift Logistics',
  mode: 'dark',
  palette: {
    primary: '#4dd7c8',
    onPrimary: '#041514',
    secondary: '#7dd3fc',
    accent: '#fbbf24',
    success: '#22c55e',
    warning: '#fbbf24',
    danger: '#f97373',
    background: '#071311',
    surface: '#10201d',
    surfaceAlt: '#172b27',
    border: 'rgba(180, 255, 238, 0.14)',
    text: '#ecfffb',
    textMuted: '#93b5af',
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    density: 'compact',
  },
  radii: {
    small: '4px',
    medium: '7px',
    large: '8px',
    pill: '999px',
  },
};

export const HARBORLIFT_TENANT_CONFIG: TenantConfig = {
  id: 'harborlift',
  name: 'HarborLift Robotics',
  displayName: 'HarborLift',
  productName: 'Yard Autonomy Console',
  description: 'Logistics robotics telemetry, yard flow, and command operations.',
  logoText: 'HL',
  theme,
  terminology: {
    machine: 'AMR',
    machines: 'AMRs',
    telemetry: 'Yard telemetry',
    command: 'Mission command',
    commands: 'Mission commands',
    site: 'Yard',
  },
  features: {
    layoutEditing: true,
    commandCenter: true,
    dockQueue: true,
  },
  metadata: {
    caseStudy: 'logistics robotics',
  },
};

export const HARBORLIFT_NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { id: 'yard', label: 'Yard', route: '/', icon: 'local_shipping', order: 0 },
  { id: 'docks', label: 'Docks', route: '/', icon: 'warehouse', order: 1 },
  { id: 'routes', label: 'Routes', route: '/', icon: 'route', order: 2 },
  { id: 'charging', label: 'Charging', route: '/', icon: 'ev_station', order: 3 },
  { id: 'commands', label: 'Commands', route: '/', icon: 'terminal', order: 4 },
];

export const HARBORLIFT_TELEMETRY_STREAMS: readonly TelemetryStreamDefinition[] = [
  {
    id: 'dock-utilization',
    label: 'Dock utilization',
    valueType: 'number',
    unit: '%',
    icon: 'warehouse',
    color: '#4dd7c8',
  },
  {
    id: 'aisle-congestion',
    label: 'Aisle congestion',
    valueType: 'number',
    unit: '%',
    icon: 'traffic',
    color: '#fbbf24',
  },
  {
    id: 'route-blockage',
    label: 'Route blockage',
    valueType: 'enum',
    icon: 'block',
    color: '#f97373',
  },
  {
    id: 'charging-queue-depth',
    label: 'Charging queue depth',
    valueType: 'number',
    unit: 'AMRs',
    icon: 'ev_station',
    color: '#7dd3fc',
  },
  {
    id: 'container-move-progress',
    label: 'Container move progress',
    valueType: 'number',
    unit: '%',
    icon: 'inventory_2',
    color: '#22c55e',
  },
  {
    id: 'handoff-status',
    label: 'Handoff status',
    valueType: 'enum',
    icon: 'swap_horiz',
    color: '#c084fc',
  },
];

export const HARBORLIFT_COMMANDS: readonly CommandDefinition[] = [
  { id: 'pause-mission', label: 'Pause mission', icon: 'pause', risk: 'medium' },
  { id: 'reroute', label: 'Reroute', icon: 'alt_route', risk: 'medium' },
  { id: 'return-to-charger', label: 'Return to charger', icon: 'ev_station', risk: 'medium' },
  {
    id: 'set-speed-limit',
    label: 'Set speed limit',
    icon: 'speed',
    risk: 'high',
    parameters: [{ id: 'metersPerSecond', label: 'm/s', type: 'number', defaultValue: 1.2 }],
  },
  { id: 'yield', label: 'Yield', icon: 'pan_tool', risk: 'low' },
  { id: 'confirm-handoff', label: 'Confirm handoff', icon: 'task_alt', risk: 'low' },
];

const blockedPathEvents: readonly DashboardEvent[] = [
  {
    id: 'block-a4',
    title: 'Aisle A4 blocked',
    detail: 'AMR lift-14 requested reroute around the transfer lane.',
    time: '1m ago',
    icon: 'warning',
    tone: 'warning',
  },
  {
    id: 'handoff-dock-3',
    title: 'Dock 3 handoff ready',
    detail: 'Container HLX-441 is staged for crane pickup.',
    time: '5m ago',
    icon: 'task_alt',
    tone: 'success',
  },
  {
    id: 'charger-q',
    title: 'Charging queue rising',
    detail: 'Four AMRs are queued after shift turnover.',
    time: '9m ago',
    icon: 'ev_station',
    tone: 'info',
  },
];

export const HARBORLIFT_TILES: readonly DashboardTileDefinition[] = [
  {
    id: 'yard-status',
    label: 'Yard Status',
    component: MetricSummaryTileComponent,
    defaultSize: 'wide',
    metadata: {
      metrics: [
        { label: 'AMRs active', value: '38', trend: '+4', icon: 'forklift', color: '#4dd7c8' },
        {
          label: 'Dock utilization',
          value: '81%',
          trend: '+6%',
          icon: 'warehouse',
          color: '#7dd3fc',
        },
        {
          label: 'Moves complete',
          value: '214',
          trend: '+18',
          icon: 'inventory_2',
          color: '#22c55e',
        },
        { label: 'Blocked paths', value: '3', trend: '+1', icon: 'block', color: '#f97373' },
      ],
    },
  },
  {
    id: 'dock-queue',
    label: 'Dock Queue',
    component: MachineTableTileComponent,
    defaultSize: 'wide',
    metadata: {
      subtitle: 'AMRs queued by dock and transfer lane',
      rows: [
        {
          name: 'lift-14',
          detail: 'Dock 3 / Container handoff',
          state: 'online',
          battery: '74%',
          temperature: '36 C',
          color: '#4dd7c8',
        },
        {
          name: 'tug-22',
          detail: 'Aisle A4 / Reroute pending',
          state: 'degraded',
          battery: '61%',
          temperature: '41 C',
          color: '#fbbf24',
        },
        {
          name: 'lift-09',
          detail: 'Charger lane / Waiting',
          state: 'maintenance',
          battery: '29%',
          temperature: '39 C',
          color: '#7dd3fc',
        },
      ],
    },
  },
  {
    id: 'container-move-progress',
    label: 'Container Move Progress',
    component: TelemetryChartTileComponent,
    defaultSize: 'medium',
    requiredTelemetryStreams: ['container-move-progress'],
    metadata: {
      subtitle: 'Completed moves by operating window',
      chartData: {
        labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00'],
        series: [{ label: 'Move progress', color: '#22c55e', values: [32, 46, 58, 71, 83, 91] }],
      },
    },
  },
  {
    id: 'charging-queue',
    label: 'Charging Queue',
    component: MetricSummaryTileComponent,
    defaultSize: 'small',
    metadata: {
      metrics: [
        { label: 'Queued AMRs', value: '4', trend: '+2', icon: 'ev_station', color: '#7dd3fc' },
        { label: 'Avg wait', value: '11m', trend: '-3m', icon: 'schedule', color: '#fbbf24' },
      ],
    },
  },
  {
    id: 'blocked-path-alerts',
    label: 'Blocked Path Alerts',
    component: EventStreamTileComponent,
    defaultSize: 'medium',
    metadata: { events: blockedPathEvents },
  },
  {
    id: 'amr-utilization',
    label: 'AMR Utilization',
    component: TelemetryChartTileComponent,
    defaultSize: 'medium',
    requiredTelemetryStreams: ['dock-utilization', 'aisle-congestion'],
    metadata: {
      subtitle: 'Utilization and congestion trend',
      chartData: {
        labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00'],
        series: [
          { label: 'Utilization', color: '#4dd7c8', values: [62, 67, 74, 81, 79, 83] },
          { label: 'Congestion', color: '#fbbf24', values: [18, 22, 28, 31, 27, 24] },
        ],
      },
    },
  },
  {
    id: 'throughput-chart',
    label: 'Throughput Chart',
    component: TelemetryChartTileComponent,
    defaultSize: 'medium',
    metadata: {
      subtitle: 'Container moves per hour',
      chartData: {
        labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00'],
        series: [{ label: 'Moves/hour', color: '#7dd3fc', values: [22, 31, 39, 44, 48, 52] }],
      },
    },
  },
  {
    id: 'yard-command-center',
    label: 'Yard Command Center',
    description: 'Logistics commands scoped to AMR missions',
    component: CommandCenterTileComponent,
    defaultSize: 'wide',
    commandIds: [
      'pause-mission',
      'reroute',
      'return-to-charger',
      'set-speed-limit',
      'yield',
      'confirm-handoff',
    ],
  },
  {
    id: 'yard-map',
    label: 'Yard Map',
    component: OperatingAreaTileComponent,
    defaultSize: 'medium',
    metadata: {
      subtitle: 'Dock lanes and active AMRs',
      meta: 'Dock 3 busy',
      nodes: [
        { icon: 'forklift', left: '22%', top: '38%', label: 'lift-14', color: '#4dd7c8' },
        { icon: 'local_shipping', left: '53%', top: '48%', label: 'tug-22', color: '#fbbf24' },
        { icon: 'ev_station', left: '78%', top: '28%', label: 'charger queue', color: '#7dd3fc' },
      ],
    },
  },
];

export const HARBORLIFT_LAYOUT: DashboardLayout = {
  id: 'harborlift-yard-layout',
  label: 'Yard Operations',
  columns: 12,
  density: 'compact',
  tiles: [
    { id: 'yard-status-placement', tileId: 'yard-status', size: 'wide', order: 0 },
    { id: 'dock-queue-placement', tileId: 'dock-queue', size: 'wide', order: 1 },
    { id: 'amr-utilization-placement', tileId: 'amr-utilization', size: 'medium', order: 2 },
    { id: 'throughput-placement', tileId: 'throughput-chart', size: 'medium', order: 3 },
    { id: 'blocked-paths-placement', tileId: 'blocked-path-alerts', size: 'medium', order: 4 },
    { id: 'yard-map-placement', tileId: 'yard-map', size: 'medium', order: 5 },
    { id: 'yard-command-placement', tileId: 'yard-command-center', size: 'wide', order: 6 },
  ],
  metadata: {},
};

export function provideHarborLiftDashboard(): Provider[] {
  return [
    { provide: TENANT_CONFIG, useValue: HARBORLIFT_TENANT_CONFIG },
    { provide: NAVIGATION_ITEMS, useValue: HARBORLIFT_NAVIGATION_ITEMS },
    { provide: TELEMETRY_STREAMS, useValue: HARBORLIFT_TELEMETRY_STREAMS },
    { provide: COMMAND_DEFINITIONS, useValue: HARBORLIFT_COMMANDS },
    { provide: DASHBOARD_TILES, useValue: HARBORLIFT_TILES },
    { provide: DASHBOARD_LAYOUT, useValue: HARBORLIFT_LAYOUT },
  ];
}
