import { InjectionToken } from '@angular/core';

import {
  type CommandDefinition,
  type DashboardLayout,
  type DashboardTileDefinition,
  type NavigationItem,
  type TelemetryStreamDefinition,
  type TenantConfig,
} from '../models';

export interface IDashboardConfigurationService {
  readonly tenant: TenantConfig;
  readonly navigationItems: readonly NavigationItem[];
  readonly dashboardLayout: DashboardLayout;
  readonly dashboardTiles: readonly DashboardTileDefinition[];
  readonly commandDefinitions: readonly CommandDefinition[];
  readonly telemetryStreams: readonly TelemetryStreamDefinition[];
}

export const DASHBOARD_CONFIGURATION_SERVICE = new InjectionToken<IDashboardConfigurationService>(
  'DASHBOARD_CONFIGURATION_SERVICE',
);
