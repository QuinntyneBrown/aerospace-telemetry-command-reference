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
  id: 'terragrid-field',
  name: 'TerraGrid Field',
  mode: 'dark',
  palette: {
    primary: '#9be15d',
    onPrimary: '#111806',
    secondary: '#67e8f9',
    accent: '#f0abfc',
    success: '#84cc16',
    warning: '#f59e0b',
    danger: '#f43f5e',
    background: '#0b1208',
    surface: '#162010',
    surfaceAlt: '#203017',
    border: 'rgba(218, 255, 174, 0.14)',
    text: '#f5ffe8',
    textMuted: '#a6bc92',
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

export const TERRAGRID_TENANT_CONFIG: TenantConfig = {
  id: 'terragrid',
  name: 'TerraGrid Autonomy',
  displayName: 'TerraGrid',
  productName: 'Field Robotics Console',
  description: 'Field coverage, payload, route, and hazard operations for outdoor robots.',
  logoText: 'TG',
  theme,
  terminology: {
    machine: 'Field robot',
    machines: 'Field robots',
    telemetry: 'Field telemetry',
    command: 'Field command',
    commands: 'Field commands',
    site: 'Field area',
  },
  features: {
    layoutEditing: true,
    commandCenter: true,
    hazardMarkers: true,
  },
  metadata: {
    caseStudy: 'field robotics',
  },
};

export const TERRAGRID_NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { id: 'field', label: 'Field', route: '/', icon: 'grass', order: 0 },
  { id: 'coverage', label: 'Coverage', route: '/', icon: 'grid_on', order: 1 },
  { id: 'routes', label: 'Routes', route: '/', icon: 'route', order: 2 },
  { id: 'payloads', label: 'Payloads', route: '/', icon: 'science', order: 3 },
  { id: 'hazards', label: 'Hazards', route: '/', icon: 'warning', order: 4 },
];

export const TERRAGRID_TELEMETRY_STREAMS: readonly TelemetryStreamDefinition[] = [
  {
    id: 'gps-route-progress',
    label: 'GPS route progress',
    valueType: 'number',
    unit: '%',
    icon: 'route',
    color: '#67e8f9',
  },
  {
    id: 'field-coverage',
    label: 'Field coverage',
    valueType: 'number',
    unit: '%',
    icon: 'grid_on',
    color: '#9be15d',
  },
  {
    id: 'weather-conditions',
    label: 'Weather conditions',
    valueType: 'json',
    icon: 'thunderstorm',
    color: '#f59e0b',
  },
  {
    id: 'terrain-state',
    label: 'Terrain state',
    valueType: 'enum',
    icon: 'terrain',
    color: '#a3e635',
  },
  {
    id: 'payload-state',
    label: 'Payload state',
    valueType: 'enum',
    icon: 'science',
    color: '#f0abfc',
  },
  {
    id: 'hazard-markers',
    label: 'Hazard markers',
    valueType: 'json',
    icon: 'warning',
    color: '#f43f5e',
  },
];

export const TERRAGRID_COMMANDS: readonly CommandDefinition[] = [
  { id: 'return-to-base', label: 'Return to base', icon: 'home_pin', risk: 'medium' },
  { id: 'pause-implement', label: 'Pause implement', icon: 'pause', risk: 'medium' },
  { id: 'adjust-route', label: 'Adjust route', icon: 'edit_road', risk: 'medium' },
  {
    id: 'reduce-speed',
    label: 'Reduce speed',
    icon: 'speed',
    risk: 'low',
    parameters: [{ id: 'percent', label: 'Percent', type: 'number', defaultValue: 60 }],
  },
  {
    id: 'start-inspection-pass',
    label: 'Start inspection pass',
    icon: 'saved_search',
    risk: 'medium',
  },
  { id: 'mark-hazard', label: 'Mark hazard', icon: 'add_location_alt', risk: 'high' },
];

const hazardEvents: readonly DashboardEvent[] = [
  {
    id: 'washout',
    title: 'Washout marker added',
    detail: 'Field robot rowan-12 marked a terrain hazard at block C7.',
    time: '3m ago',
    icon: 'add_location_alt',
    tone: 'warning',
  },
  {
    id: 'payload-ready',
    title: 'Payload sample complete',
    detail: 'Soil payload completed pass 4 with calibrated readings.',
    time: '7m ago',
    icon: 'science',
    tone: 'success',
  },
  {
    id: 'weather-watch',
    title: 'Weather watch',
    detail: 'Wind gusts exceed the inspection threshold near the north ridge.',
    time: '14m ago',
    icon: 'air',
    tone: 'info',
  },
];

export const TERRAGRID_TILES: readonly DashboardTileDefinition[] = [
  {
    id: 'field-coverage',
    label: 'Field Coverage',
    component: MetricSummaryTileComponent,
    defaultSize: 'wide',
    metadata: {
      metrics: [
        { label: 'Coverage', value: '68%', trend: '+11%', icon: 'grid_on', color: '#9be15d' },
        { label: 'Route progress', value: '74%', trend: '+8%', icon: 'route', color: '#67e8f9' },
        { label: 'Payloads ready', value: '5', trend: 'steady', icon: 'science', color: '#f0abfc' },
        { label: 'Open hazards', value: '4', trend: '+1', icon: 'warning', color: '#f43f5e' },
      ],
    },
  },
  {
    id: 'route-progress',
    label: 'Route Progress',
    component: TelemetryChartTileComponent,
    defaultSize: 'medium',
    requiredTelemetryStreams: ['gps-route-progress'],
    metadata: {
      subtitle: 'GPS route completion by hour',
      chartData: {
        labels: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'],
        series: [{ label: 'Progress', color: '#67e8f9', values: [12, 24, 39, 52, 63, 74] }],
      },
    },
  },
  {
    id: 'weather-terrain',
    label: 'Weather and Terrain',
    component: MetricSummaryTileComponent,
    defaultSize: 'small',
    metadata: {
      metrics: [
        { label: 'Wind', value: '17 mph', trend: '+4', icon: 'air', color: '#f59e0b' },
        {
          label: 'Terrain',
          value: 'Firm',
          trend: 'north ridge soft',
          icon: 'terrain',
          color: '#a3e635',
        },
      ],
    },
  },
  {
    id: 'payload-status',
    label: 'Payload Status',
    component: MachineTableTileComponent,
    defaultSize: 'wide',
    metadata: {
      subtitle: 'Payload state by field robot',
      rows: [
        {
          name: 'rowan-12',
          detail: 'Soil probe / Pass 4',
          state: 'online',
          battery: '76%',
          temperature: '34 C',
          color: '#9be15d',
        },
        {
          name: 'mesa-04',
          detail: 'Thermal camera / Ridge scan',
          state: 'online',
          battery: '88%',
          temperature: '37 C',
          color: '#67e8f9',
        },
        {
          name: 'sage-19',
          detail: 'Seeder payload / Paused implement',
          state: 'degraded',
          battery: '58%',
          temperature: '42 C',
          color: '#f59e0b',
        },
      ],
    },
  },
  {
    id: 'hazard-markers',
    label: 'Hazard Markers',
    component: EventStreamTileComponent,
    defaultSize: 'medium',
    metadata: { events: hazardEvents },
  },
  {
    id: 'inspection-progress',
    label: 'Inspection Progress',
    component: TelemetryChartTileComponent,
    defaultSize: 'medium',
    metadata: {
      subtitle: 'Inspection passes completed by sector',
      chartData: {
        labels: ['A1', 'A2', 'B4', 'C7', 'D2', 'E5'],
        series: [{ label: 'Passes', color: '#f0abfc', values: [100, 96, 82, 43, 58, 27] }],
      },
    },
  },
  {
    id: 'battery-thermal-chart',
    label: 'Battery and Thermal Chart',
    component: TelemetryChartTileComponent,
    defaultSize: 'medium',
    metadata: {
      subtitle: 'Battery state and drive temperature',
      chartData: {
        labels: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'],
        series: [
          { label: 'Battery', color: '#9be15d', values: [94, 89, 84, 79, 72, 68] },
          { label: 'Thermal', color: '#f59e0b', values: [31, 33, 36, 38, 40, 41] },
        ],
      },
    },
  },
  {
    id: 'field-map',
    label: 'Field Map',
    component: OperatingAreaTileComponent,
    defaultSize: 'medium',
    metadata: {
      subtitle: 'Field robots, routes, and marked hazards',
      meta: 'Block C7 watch',
      nodes: [
        { icon: 'agriculture', left: '20%', top: '62%', label: 'rowan-12', color: '#9be15d' },
        { icon: 'route', left: '48%', top: '35%', label: 'mesa-04', color: '#67e8f9' },
        { icon: 'warning', left: '69%', top: '56%', label: 'hazard C7', color: '#f43f5e' },
      ],
    },
  },
  {
    id: 'field-command-center',
    label: 'Field Command Center',
    description: 'Field robotics commands scoped to route and payload operations',
    component: CommandCenterTileComponent,
    defaultSize: 'wide',
    commandIds: [
      'return-to-base',
      'pause-implement',
      'adjust-route',
      'reduce-speed',
      'start-inspection-pass',
      'mark-hazard',
    ],
  },
];

export const TERRAGRID_LAYOUT: DashboardLayout = {
  id: 'terragrid-field-layout',
  label: 'Field Operations',
  columns: 12,
  density: 'comfortable',
  tiles: [
    { id: 'field-coverage-placement', tileId: 'field-coverage', size: 'wide', order: 0 },
    { id: 'payload-status-placement', tileId: 'payload-status', size: 'wide', order: 1 },
    { id: 'route-progress-placement', tileId: 'route-progress', size: 'medium', order: 2 },
    { id: 'battery-thermal-placement', tileId: 'battery-thermal-chart', size: 'medium', order: 3 },
    { id: 'hazard-markers-placement', tileId: 'hazard-markers', size: 'medium', order: 4 },
    { id: 'field-map-placement', tileId: 'field-map', size: 'medium', order: 5 },
    { id: 'field-command-placement', tileId: 'field-command-center', size: 'wide', order: 6 },
  ],
  metadata: {},
};

export function provideTerraGridDashboard(): Provider[] {
  return [
    { provide: TENANT_CONFIG, useValue: TERRAGRID_TENANT_CONFIG },
    { provide: NAVIGATION_ITEMS, useValue: TERRAGRID_NAVIGATION_ITEMS },
    { provide: TELEMETRY_STREAMS, useValue: TERRAGRID_TELEMETRY_STREAMS },
    { provide: COMMAND_DEFINITIONS, useValue: TERRAGRID_COMMANDS },
    { provide: DASHBOARD_TILES, useValue: TERRAGRID_TILES },
    { provide: DASHBOARD_LAYOUT, useValue: TERRAGRID_LAYOUT },
  ];
}
