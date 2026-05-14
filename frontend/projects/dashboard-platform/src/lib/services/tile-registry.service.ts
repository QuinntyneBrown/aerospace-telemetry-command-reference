import { Injectable, inject } from '@angular/core';

import { type ITileRegistryService } from '../contracts';
import { DASHBOARD_TILES, TENANT_CONFIG } from '../tokens';
import { type DashboardTileDefinition } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TileRegistryService implements ITileRegistryService {
  private readonly tenant = inject(TENANT_CONFIG);
  private readonly tiles = inject(DASHBOARD_TILES);

  getAvailableTiles(): readonly DashboardTileDefinition[] {
    return this.tiles.filter((tile) => {
      if (!tile.featureFlag) {
        return true;
      }

      return this.tenant.features[tile.featureFlag] !== false;
    });
  }

  getTile(tileId: string): DashboardTileDefinition | undefined {
    return this.getAvailableTiles().find((tile) => tile.id === tileId);
  }
}
