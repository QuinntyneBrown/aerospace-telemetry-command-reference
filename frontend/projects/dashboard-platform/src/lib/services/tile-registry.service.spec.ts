import { TestBed } from '@angular/core/testing';

import { DEFAULT_TENANT_CONFIG } from '../defaults';
import { type DashboardTileDefinition } from '../models';
import { DASHBOARD_TILES, TENANT_CONFIG } from '../tokens';
import { TileRegistryService } from './tile-registry.service';

class TestTileComponent {}

describe('TileRegistryService', () => {
  const tiles: readonly DashboardTileDefinition[] = [
    {
      id: 'always-visible',
      label: 'Always Visible',
      component: TestTileComponent,
      defaultSize: 'small',
    },
    {
      id: 'feature-enabled',
      label: 'Feature Enabled',
      component: TestTileComponent,
      defaultSize: 'small',
      featureFlag: 'enabledFeature',
    },
    {
      id: 'feature-disabled',
      label: 'Feature Disabled',
      component: TestTileComponent,
      defaultSize: 'small',
      featureFlag: 'disabledFeature',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TileRegistryService,
        {
          provide: TENANT_CONFIG,
          useValue: {
            ...DEFAULT_TENANT_CONFIG,
            features: {
              enabledFeature: true,
              disabledFeature: false,
            },
          },
        },
        { provide: DASHBOARD_TILES, useValue: tiles },
      ],
    });
  });

  it('returns tiles without disabled feature flags', () => {
    expect(
      TestBed.inject(TileRegistryService)
        .getAvailableTiles()
        .map((tile) => tile.id),
    ).toEqual(['always-visible', 'feature-enabled']);
  });

  it('finds a visible tile by id', () => {
    const service = TestBed.inject(TileRegistryService);

    expect(service.getTile('feature-enabled')?.label).toBe('Feature Enabled');
    expect(service.getTile('feature-disabled')).toBeUndefined();
  });
});
