import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import {
  DASHBOARD_LAYOUT_PERSISTENCE_SERVICE,
  TILE_REGISTRY_SERVICE,
  type IDashboardLayoutPersistenceService,
  type ITileRegistryService,
} from '../../contracts';
import {
  type DashboardLayout,
  type DashboardTileDefinition,
  type DashboardTileSize,
} from '../../models';
import { DASHBOARD_LAYOUT } from '../../tokens';
import { MetricSummaryTileComponent } from '../metric-summary-tile/metric-summary-tile.component';
import { TileGridComponent } from './tile-grid.component';

interface TileGridHarness {
  setEditMode(value: boolean): void;
  onTileAdded(tileId: string): void;
  onTileRemoved(placementId: string): void;
  onTileResized(placementId: string, size: DashboardTileSize): void;
}

class FakeLayoutPersistenceService implements IDashboardLayoutPersistenceService {
  constructor(private readonly layout: DashboardLayout) {}

  readonly load = vi.fn((_: DashboardLayout) => this.layout);
  readonly save = vi.fn((_: DashboardLayout) => undefined);
  readonly reset = vi.fn((_: DashboardLayout) => this.layout);
  readonly addTile = vi.fn(
    (_: DashboardLayout, _tileId: string, _size: DashboardTileSize) => this.layout,
  );
  readonly removeTile = vi.fn((_: DashboardLayout, _placementId: string) => this.layout);
  readonly resizeTile = vi.fn(
    (_: DashboardLayout, _placementId: string, _size: DashboardTileSize) => this.layout,
  );
}

describe('TileGridComponent', () => {
  const tile: DashboardTileDefinition = {
    id: 'metric',
    label: 'Metric',
    component: MetricSummaryTileComponent,
    defaultSize: 'medium',
    metadata: { metrics: [] },
  };
  const layout: DashboardLayout = {
    id: 'grid-layout',
    label: 'Grid Layout',
    columns: 12,
    density: 'comfortable',
    tiles: [{ id: 'metric-placement', tileId: 'metric', size: 'medium', order: 0 }],
    metadata: {},
  };
  let persistence: FakeLayoutPersistenceService;
  let harness: TileGridHarness;

  beforeEach(async () => {
    const registry: ITileRegistryService = {
      getAvailableTiles: () => [tile],
      getTile: (tileId) => (tileId === tile.id ? tile : undefined),
    };
    persistence = new FakeLayoutPersistenceService(layout);

    await TestBed.configureTestingModule({
      imports: [TileGridComponent],
      providers: [
        { provide: TILE_REGISTRY_SERVICE, useValue: registry },
        { provide: DASHBOARD_LAYOUT_PERSISTENCE_SERVICE, useValue: persistence },
        { provide: DASHBOARD_LAYOUT, useValue: layout },
      ],
    }).compileComponents();

    harness = TestBed.createComponent(TileGridComponent)
      .componentInstance as unknown as TileGridHarness;
  });

  it('locks add, remove, and resize while edit mode is off', () => {
    harness.onTileAdded('metric');
    harness.onTileRemoved('metric-placement');
    harness.onTileResized('metric-placement', 'wide');

    expect(persistence.addTile).not.toHaveBeenCalled();
    expect(persistence.removeTile).not.toHaveBeenCalled();
    expect(persistence.resizeTile).not.toHaveBeenCalled();
  });

  it('allows add, remove, and resize while edit mode is on', () => {
    harness.setEditMode(true);

    harness.onTileAdded('metric');
    harness.onTileRemoved('metric-placement');
    harness.onTileResized('metric-placement', 'wide');

    expect(persistence.addTile).toHaveBeenCalledWith(layout, 'metric', 'medium');
    expect(persistence.removeTile).toHaveBeenCalledWith(layout, 'metric-placement');
    expect(persistence.resizeTile).toHaveBeenCalledWith(layout, 'metric-placement', 'wide');
  });
});
