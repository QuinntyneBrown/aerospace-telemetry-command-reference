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
  TelemetryStreamTileComponent,
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
  id: 'viam-reference-dark',
  name: 'Viam Reference Dark',
  mode: 'dark',
  palette: {
    primary: '#63d7ff',
    onPrimary: '#04121a',
    secondary: '#6ee7b7',
    accent: '#f8c455',
    success: '#6ee7b7',
    warning: '#f8c455',
    danger: '#fb7185',
    background: '#071017',
    surface: '#111c24',
    surfaceAlt: '#172832',
    border: 'rgba(220, 245, 255, 0.14)',
    text: '#eef8ff',
    textMuted: '#92a8b7',
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    density: 'comfortable',
  },
  radii: {
    small: '4px',
    medium: '8px',
    large: '10px',
    pill: '999px',
  },
};

export const WHITE_LABEL_TENANT_CONFIG: TenantConfig = {
  id: 'viam-reference',
  name: 'Viam Reference Operations',
  displayName: 'Viam Reference',
  productName: 'Operations Console',
  description: 'Configurable robotics telemetry and command dashboard.',
  logoText: 'VR',
  theme,
  terminology: {
    machine: 'Machine',
    machines: 'Machines',
    telemetry: 'Telemetry',
    command: 'Command',
    commands: 'Commands',
    site: 'Operating area',
  },
  features: {
    layoutEditing: true,
    commandCenter: true,
  },
  metadata: {
    company: 'Viam',
    dashboardRole: 'white-label reference',
  },
};

export const WHITE_LABEL_NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { id: 'overview', label: 'Overview', route: '/', icon: 'space_dashboard', order: 0 },
  { id: 'fleet', label: 'Fleet', route: '/', icon: 'precision_manufacturing', order: 1 },
  { id: 'telemetry', label: 'Telemetry', route: '/', icon: 'monitoring', order: 2 },
  { id: 'commands', label: 'Commands', route: '/', icon: 'terminal', order: 3 },
];

export const WHITE_LABEL_TELEMETRY_STREAMS: readonly TelemetryStreamDefinition[] = [
  {
    id: 'fleet-health',
    label: 'Fleet health',
    valueType: 'number',
    unit: '%',
    icon: 'health_and_safety',
    color: '#6ee7b7',
  },
  {
    id: 'telemetry-ingest',
    label: 'Telemetry ingest',
    valueType: 'number',
    unit: 'msg/s',
    icon: 'hub',
    color: '#63d7ff',
  },
  {
    id: 'command-latency',
    label: 'Command latency',
    valueType: 'number',
    unit: 'ms',
    icon: 'bolt',
    color: '#f8c455',
  },
  {
    id: 'battery-state',
    label: 'Battery state',
    valueType: 'number',
    unit: '%',
    icon: 'battery_5_bar',
    color: '#a78bfa',
  },
];

export const WHITE_LABEL_COMMANDS: readonly CommandDefinition[] = [
  { id: 'pause', label: 'Pause', icon: 'pause', risk: 'medium' },
  { id: 'resume', label: 'Resume', icon: 'play_arrow', risk: 'low' },
  { id: 'return-to-base', label: 'Return to base', icon: 'home_pin', risk: 'medium' },
  { id: 'restart-component', label: 'Restart component', icon: 'restart_alt', risk: 'high' },
  { id: 'lock-out', label: 'Lock out', icon: 'lock', risk: 'high', confirmationRequired: true },
];

const events: readonly DashboardEvent[] = [
  {
    id: 'fleet-ready',
    title: 'Fleet ready',
    detail: 'Three machines reported active telemetry.',
    time: '2m ago',
    icon: 'verified',
    tone: 'success',
  },
  {
    id: 'command-auth',
    title: 'Command authorization',
    detail: 'High-risk commands require operator approval.',
    time: '8m ago',
    icon: 'admin_panel_settings',
    tone: 'info',
  },
  {
    id: 'route-hold',
    title: 'Mission hold',
    detail: 'One machine is waiting on a route update.',
    time: '12m ago',
    icon: 'pause_circle',
    tone: 'warning',
  },
];

export const WHITE_LABEL_TILES: readonly DashboardTileDefinition[] = [
  {
    id: 'fleet-overview',
    label: 'Fleet Overview',
    component: MetricSummaryTileComponent,
    defaultSize: 'wide',
    metadata: {
      metrics: [
        { label: 'Online machines', value: '12', trend: '+2', icon: 'robot_2', color: '#63d7ff' },
        { label: 'Fleet health', value: '94%', trend: '+1.8%', icon: 'favorite', color: '#6ee7b7' },
        { label: 'Active missions', value: '7', trend: 'steady', icon: 'route', color: '#f8c455' },
        {
          label: 'Alerts',
          value: '2',
          trend: '-1',
          icon: 'notification_important',
          color: '#fb7185',
        },
      ],
    },
  },
  {
    id: 'fleet-health-chart',
    label: 'Fleet Health Chart',
    component: TelemetryChartTileComponent,
    defaultSize: 'medium',
    requiredTelemetryStreams: ['fleet-health'],
    metadata: {
      subtitle: 'Health score by rolling sample',
      chartData: {
        labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
        series: [{ label: 'Health', color: '#6ee7b7', values: [91, 92, 94, 93, 95, 94] }],
      },
    },
  },
  {
    id: 'telemetry-ingest-chart',
    label: 'Telemetry Ingest',
    component: TelemetryChartTileComponent,
    defaultSize: 'medium',
    requiredTelemetryStreams: ['telemetry-ingest'],
    metadata: {
      subtitle: 'Messages received per second',
      chartData: {
        labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
        series: [{ label: 'Ingest', color: '#63d7ff', values: [420, 455, 510, 488, 535, 560] }],
      },
    },
  },
  {
    id: 'command-latency-chart',
    label: 'Command Latency',
    component: TelemetryChartTileComponent,
    defaultSize: 'small',
    requiredTelemetryStreams: ['command-latency'],
    metadata: {
      subtitle: 'P95 command acknowledgement',
      chartData: {
        labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
        series: [{ label: 'Latency', color: '#f8c455', values: [178, 163, 151, 156, 144, 139] }],
      },
    },
  },
  {
    id: 'machine-table',
    label: 'Machine Table',
    component: MachineTableTileComponent,
    defaultSize: 'wide',
    metadata: {
      subtitle: 'Reference machines connected through telemetry streams',
      rows: [
        {
          name: 'alpha-07',
          detail: 'Rover / Active mission',
          state: 'online',
          battery: '82%',
          temperature: '38 C',
          color: '#6ee7b7',
        },
        {
          name: 'nova-03',
          detail: 'AMR / Route hold',
          state: 'degraded',
          battery: '68%',
          temperature: '43 C',
          color: '#f8c455',
        },
        {
          name: 'orion-02',
          detail: 'Manipulator / Docked',
          state: 'online',
          battery: '100%',
          temperature: '32 C',
          color: '#63d7ff',
        },
      ],
    },
  },
  {
    id: 'command-center',
    label: 'Command Center',
    description: 'Neutral command catalog for reference dashboards',
    component: CommandCenterTileComponent,
    defaultSize: 'wide',
    commandIds: ['pause', 'resume', 'return-to-base', 'restart-component', 'lock-out'],
  },
  {
    id: 'event-stream',
    label: 'Event Stream',
    component: EventStreamTileComponent,
    defaultSize: 'medium',
    metadata: { events },
  },
  {
    id: 'operating-area',
    label: 'Operating Area',
    component: OperatingAreaTileComponent,
    defaultSize: 'medium',
    metadata: {
      subtitle: 'Reference lab and remote machines',
      meta: '3 live nodes',
      nodes: [
        { icon: 'robot_2', left: '28%', top: '42%', label: 'alpha-07', color: '#63d7ff' },
        { icon: 'conversion_path', left: '58%', top: '34%', label: 'nova-03', color: '#f8c455' },
        {
          icon: 'precision_manufacturing',
          left: '72%',
          top: '62%',
          label: 'orion-02',
          color: '#6ee7b7',
        },
      ],
    },
  },
  {
    id: 'telemetry-stream',
    label: 'Telemetry Stream',
    component: TelemetryStreamTileComponent,
    defaultSize: 'medium',
    requiredTelemetryStreams: ['fleet-health', 'command-latency'],
  },
];

export const WHITE_LABEL_LAYOUT: DashboardLayout = {
  id: 'viam-reference-layout',
  label: 'Reference Operations',
  columns: 12,
  density: 'comfortable',
  tiles: [
    { id: 'fleet-overview-placement', tileId: 'fleet-overview', size: 'wide', order: 0 },
    { id: 'machine-table-placement', tileId: 'machine-table', size: 'wide', order: 1 },
    { id: 'fleet-health-placement', tileId: 'fleet-health-chart', size: 'medium', order: 2 },
    {
      id: 'telemetry-ingest-placement',
      tileId: 'telemetry-ingest-chart',
      size: 'medium',
      order: 3,
    },
    { id: 'command-center-placement', tileId: 'command-center', size: 'wide', order: 4 },
    { id: 'event-stream-placement', tileId: 'event-stream', size: 'medium', order: 5 },
    { id: 'operating-area-placement', tileId: 'operating-area', size: 'medium', order: 6 },
  ],
  metadata: {},
};

export function provideWhiteLabelDashboard(): Provider[] {
  return [
    { provide: TENANT_CONFIG, useValue: WHITE_LABEL_TENANT_CONFIG },
    { provide: NAVIGATION_ITEMS, useValue: WHITE_LABEL_NAVIGATION_ITEMS },
    { provide: TELEMETRY_STREAMS, useValue: WHITE_LABEL_TELEMETRY_STREAMS },
    { provide: COMMAND_DEFINITIONS, useValue: WHITE_LABEL_COMMANDS },
    { provide: DASHBOARD_TILES, useValue: WHITE_LABEL_TILES },
    { provide: DASHBOARD_LAYOUT, useValue: WHITE_LABEL_LAYOUT },
  ];
}
