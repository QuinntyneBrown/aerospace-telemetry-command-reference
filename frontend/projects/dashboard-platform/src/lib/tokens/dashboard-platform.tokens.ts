import { InjectionToken } from '@angular/core';

import {
  DEFAULT_DASHBOARD_LAYOUT,
  DEFAULT_NAVIGATION_ITEMS,
  DEFAULT_TENANT_CONFIG,
} from '../defaults';
import {
  type CommandDefinition,
  type DashboardLayout,
  type DashboardTileDefinition,
  type NavigationItem,
  type TelemetryStreamDefinition,
  type TenantConfig,
} from '../models';

export const TENANT_CONFIG = new InjectionToken<TenantConfig>('TENANT_CONFIG', {
  factory: () => DEFAULT_TENANT_CONFIG,
});

export const DASHBOARD_TILES = new InjectionToken<readonly DashboardTileDefinition[]>(
  'DASHBOARD_TILES',
  {
    factory: () => [],
  },
);

export const COMMAND_DEFINITIONS = new InjectionToken<readonly CommandDefinition[]>(
  'COMMAND_DEFINITIONS',
  {
    factory: () => [],
  },
);

export const TELEMETRY_STREAMS = new InjectionToken<readonly TelemetryStreamDefinition[]>(
  'TELEMETRY_STREAMS',
  {
    factory: () => [],
  },
);

export const DASHBOARD_LAYOUT = new InjectionToken<DashboardLayout>('DASHBOARD_LAYOUT', {
  factory: () => DEFAULT_DASHBOARD_LAYOUT,
});

export const NAVIGATION_ITEMS = new InjectionToken<readonly NavigationItem[]>('NAVIGATION_ITEMS', {
  factory: () => DEFAULT_NAVIGATION_ITEMS,
});

export const DASHBOARD_API_BASE_URL = new InjectionToken<string>('DASHBOARD_API_BASE_URL', {
  factory: () => 'http://localhost:5121',
});
