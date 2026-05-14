import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import {
  DASHBOARD_LAYOUT_PERSISTENCE_SERVICE,
  TELEMETRY_STREAM_SERVICE,
  TILE_REGISTRY_SERVICE,
  type IDashboardLayoutPersistenceService,
  type ITileRegistryService,
} from '../../contracts';
import {
  type DashboardLayout,
  type DashboardTileDefinition,
  type DashboardTileSize,
} from '../../models';
import { DASHBOARD_LAYOUT, TELEMETRY_STREAMS } from '../../tokens';
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
    (layout: DashboardLayout, placementId: string, size: DashboardTileSize) => ({
      ...layout,
      tiles: layout.tiles.map((placement) =>
        placement.id === placementId ? { ...placement, size } : placement,
      ),
    }),
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
    tiles: [
      { id: 'metric-placement', tileId: 'metric', size: 'wide', order: 0 },
      { id: 'metric-placement-2', tileId: 'metric', size: 'medium', order: 1 },
      { id: 'metric-placement-3', tileId: 'metric', size: 'small', order: 2 },
    ],
    metadata: {},
  };
  let persistence: FakeLayoutPersistenceService;
  let fixture: ComponentFixture<TileGridComponent>;
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
        {
          provide: TELEMETRY_STREAM_SERVICE,
          useValue: {
            samples: () => of([]),
            machines: () => of([]),
          },
        },
        { provide: TELEMETRY_STREAMS, useValue: [] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TileGridComponent);
    harness = fixture.componentInstance as unknown as TileGridHarness;
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

  it('shows each tile size selector with the current placement size', () => {
    harness.setEditMode(true);
    fixture.detectChanges();

    const sizeSelectors = [
      ...fixture.nativeElement.querySelectorAll('select[aria-label^="Resize"]'),
    ] as HTMLSelectElement[];

    expect(sizeSelectors.map((selector) => selector.value)).toEqual(['wide', 'medium', 'small']);
  });

  it('updates the tile size selector value after resizing a placement', () => {
    harness.setEditMode(true);
    fixture.detectChanges();

    const sizeSelector = fixture.nativeElement.querySelector(
      'select[aria-label="Resize Metric"]',
    ) as HTMLSelectElement;

    sizeSelector.value = 'full';
    sizeSelector.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(persistence.resizeTile).toHaveBeenCalledWith(layout, 'metric-placement', 'full');
    expect(
      (fixture.nativeElement.querySelector(
        'select[aria-label="Resize Metric"]',
      ) as HTMLSelectElement).value,
    ).toBe('full');
  });

  it('shows registered tile options only after edit mode is enabled', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('viam-tile-add-form')).toBeNull();

    harness.setEditMode(true);
    fixture.detectChanges();

    const options = [
      ...fixture.nativeElement.querySelectorAll('viam-tile-add-form option'),
    ] as HTMLOptionElement[];

    expect(options.map((option) => option.textContent?.trim())).toEqual(['Metric']);
    expect(options.map((option) => option.value)).toEqual(['metric']);
  });
});
