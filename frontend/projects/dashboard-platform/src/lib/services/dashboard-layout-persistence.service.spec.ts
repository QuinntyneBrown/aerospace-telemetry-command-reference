import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { DEFAULT_TENANT_CONFIG } from '../defaults';
import { type DashboardLayout } from '../models';
import { TENANT_CONFIG } from '../tokens';
import { DashboardLayoutPersistenceService } from './dashboard-layout-persistence.service';

describe('DashboardLayoutPersistenceService', () => {
  const layout: DashboardLayout = {
    id: 'test-layout',
    label: 'Test Layout',
    columns: 12,
    density: 'comfortable',
    tiles: [{ id: 'first-placement', tileId: 'first-tile', size: 'medium', order: 0 }],
    metadata: {},
  };

  let service: DashboardLayoutPersistenceService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        DashboardLayoutPersistenceService,
        {
          provide: TENANT_CONFIG,
          useValue: { ...DEFAULT_TENANT_CONFIG, id: 'test-tenant' },
        },
      ],
    });
    service = TestBed.inject(DashboardLayoutPersistenceService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('adds and persists a tile placement', () => {
    vi.spyOn(Date, 'now').mockReturnValue(42);

    const updated = service.addTile(layout, 'second-tile', 'small');

    expect(updated.tiles).toHaveLength(2);
    expect(updated.tiles[1]).toEqual({
      id: 'second-tile-42',
      tileId: 'second-tile',
      size: 'small',
      order: 1,
    });
    expect(service.load(layout).tiles).toHaveLength(2);
  });

  it('does not remove the final tile in a demo layout', () => {
    expect(service.removeTile(layout, 'first-placement')).toBe(layout);
  });

  it('removes and resizes placements when more than one tile exists', () => {
    const twoTileLayout: DashboardLayout = {
      ...layout,
      tiles: [
        ...layout.tiles,
        { id: 'second-placement', tileId: 'second-tile', size: 'small', order: 1 },
      ],
    };

    const resized = service.resizeTile(twoTileLayout, 'second-placement', 'wide');
    const removed = service.removeTile(resized, 'first-placement');

    expect(resized.tiles[1].size).toBe('wide');
    expect(removed.tiles.map((tile) => tile.id)).toEqual(['second-placement']);
  });
});
