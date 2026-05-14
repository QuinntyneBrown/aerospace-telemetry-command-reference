import { Injectable, inject } from '@angular/core';

import { type IDashboardLayoutPersistenceService } from '../contracts';
import {
  type DashboardLayout,
  type DashboardTilePlacement,
  type DashboardTileSize,
} from '../models';
import { TENANT_CONFIG } from '../tokens';

@Injectable({
  providedIn: 'root',
})
export class DashboardLayoutPersistenceService implements IDashboardLayoutPersistenceService {
  private readonly tenant = inject(TENANT_CONFIG);

  load(layout: DashboardLayout): DashboardLayout {
    const stored = this.read(layout.id);

    if (!stored) {
      return layout;
    }

    return {
      ...layout,
      tiles: stored.tiles,
    };
  }

  save(layout: DashboardLayout): void {
    this.write(layout);
  }

  reset(layout: DashboardLayout): DashboardLayout {
    this.remove(layout.id);
    return layout;
  }

  addTile(layout: DashboardLayout, tileId: string, size: DashboardTileSize): DashboardLayout {
    const nextOrder = layout.tiles.reduce((max, tile) => Math.max(max, tile.order), -1) + 1;
    const placement: DashboardTilePlacement = {
      id: `${tileId}-${Date.now()}`,
      tileId,
      size,
      order: nextOrder,
    };

    return this.persist({
      ...layout,
      tiles: [...layout.tiles, placement],
    });
  }

  removeTile(layout: DashboardLayout, placementId: string): DashboardLayout {
    if (layout.tiles.length <= 1) {
      return layout;
    }

    return this.persist({
      ...layout,
      tiles: layout.tiles.filter((tile) => tile.id !== placementId),
    });
  }

  resizeTile(
    layout: DashboardLayout,
    placementId: string,
    size: DashboardTileSize,
  ): DashboardLayout {
    return this.persist({
      ...layout,
      tiles: layout.tiles.map((tile) => (tile.id === placementId ? { ...tile, size } : tile)),
    });
  }

  private persist(layout: DashboardLayout): DashboardLayout {
    this.save(layout);
    return layout;
  }

  private storageKey(layoutId: string): string {
    return `dashboard-layout:${this.tenant.id}:${layoutId}`;
  }

  private read(layoutId: string): Pick<DashboardLayout, 'tiles'> | null {
    try {
      const value = globalThis.localStorage?.getItem(this.storageKey(layoutId));
      return value ? (JSON.parse(value) as Pick<DashboardLayout, 'tiles'>) : null;
    } catch {
      return null;
    }
  }

  private write(layout: DashboardLayout): void {
    try {
      globalThis.localStorage?.setItem(
        this.storageKey(layout.id),
        JSON.stringify({ tiles: layout.tiles }),
      );
    } catch {
      return;
    }
  }

  private remove(layoutId: string): void {
    try {
      globalThis.localStorage?.removeItem(this.storageKey(layoutId));
    } catch {
      return;
    }
  }
}
