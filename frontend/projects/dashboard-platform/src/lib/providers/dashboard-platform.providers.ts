import { type Provider } from '@angular/core';

import {
  COMMAND_DISPATCH_SERVICE,
  DASHBOARD_LAYOUT_PERSISTENCE_SERVICE,
  TELEMETRY_STREAM_SERVICE,
  TILE_REGISTRY_SERVICE,
} from '../contracts';
import {
  CommandDispatchService,
  BackendTelemetryStreamService,
  DashboardLayoutPersistenceService,
  TileRegistryService,
} from '../services';

export function provideDashboardPlatform(): Provider[] {
  return [
    CommandDispatchService,
    BackendTelemetryStreamService,
    DashboardLayoutPersistenceService,
    TileRegistryService,
    {
      provide: COMMAND_DISPATCH_SERVICE,
      useExisting: CommandDispatchService,
    },
    {
      provide: DASHBOARD_LAYOUT_PERSISTENCE_SERVICE,
      useExisting: DashboardLayoutPersistenceService,
    },
    {
      provide: TELEMETRY_STREAM_SERVICE,
      useExisting: BackendTelemetryStreamService,
    },
    {
      provide: TILE_REGISTRY_SERVICE,
      useExisting: TileRegistryService,
    },
  ];
}
