import { InjectionToken } from '@angular/core';

import { type DashboardLayout, type DashboardTileSize } from '../models';

export interface IDashboardLayoutPersistenceService {
  load(layout: DashboardLayout): DashboardLayout;
  save(layout: DashboardLayout): void;
  reset(layout: DashboardLayout): DashboardLayout;
  addTile(layout: DashboardLayout, tileId: string, size: DashboardTileSize): DashboardLayout;
  removeTile(layout: DashboardLayout, placementId: string): DashboardLayout;
  resizeTile(
    layout: DashboardLayout,
    placementId: string,
    size: DashboardTileSize,
  ): DashboardLayout;
}

export const DASHBOARD_LAYOUT_PERSISTENCE_SERVICE =
  new InjectionToken<IDashboardLayoutPersistenceService>('DASHBOARD_LAYOUT_PERSISTENCE_SERVICE');
