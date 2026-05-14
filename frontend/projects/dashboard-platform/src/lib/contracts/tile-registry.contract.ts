import { InjectionToken } from '@angular/core';

import { type DashboardTileDefinition } from '../models';

export interface ITileRegistryService {
  getAvailableTiles(): readonly DashboardTileDefinition[];
  getTile(tileId: string): DashboardTileDefinition | undefined;
}

export const TILE_REGISTRY_SERVICE = new InjectionToken<ITileRegistryService>(
  'TILE_REGISTRY_SERVICE',
);
