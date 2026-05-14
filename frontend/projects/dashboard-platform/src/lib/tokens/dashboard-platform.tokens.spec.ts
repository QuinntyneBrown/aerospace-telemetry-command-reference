import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import {
  DEFAULT_DASHBOARD_LAYOUT,
  DEFAULT_NAVIGATION_ITEMS,
  DEFAULT_TENANT_CONFIG,
} from '../defaults';
import {
  type CommandDefinition,
  type DashboardLayout,
  type DashboardTileDefinition,
  type NavigationItem,
  type TelemetryStreamDefinition,
  type TenantConfig,
} from '../models';
import {
  COMMAND_DEFINITIONS,
  DASHBOARD_LAYOUT,
  DASHBOARD_TILES,
  NAVIGATION_ITEMS,
  TELEMETRY_STREAMS,
  TENANT_CONFIG,
} from './dashboard-platform.tokens';

class TestTileComponent {}

describe('dashboard platform provider tokens', () => {
  it('provides default tenant, layout, navigation, and empty registries', () => {
    TestBed.configureTestingModule({});

    expect(TestBed.inject(TENANT_CONFIG)).toBe(DEFAULT_TENANT_CONFIG);
    expect(TestBed.inject(DASHBOARD_LAYOUT)).toBe(DEFAULT_DASHBOARD_LAYOUT);
    expect(TestBed.inject(NAVIGATION_ITEMS)).toBe(DEFAULT_NAVIGATION_ITEMS);
    expect(TestBed.inject(DASHBOARD_TILES)).toEqual([]);
    expect(TestBed.inject(COMMAND_DEFINITIONS)).toEqual([]);
    expect(TestBed.inject(TELEMETRY_STREAMS)).toEqual([]);
  });

  it('accepts dashboard-specific provider values through the shared tokens', () => {
    const tenant: TenantConfig = {
      ...DEFAULT_TENANT_CONFIG,
      id: 'custom-tenant',
      displayName: 'Custom Tenant',
    };
    const layout: DashboardLayout = {
      ...DEFAULT_DASHBOARD_LAYOUT,
      id: 'field-layout',
    };
    const navigationItems: readonly NavigationItem[] = [
      { id: 'field', label: 'Field', route: '/field' },
    ];
    const dashboardTiles: readonly DashboardTileDefinition[] = [
      {
        id: 'coverage',
        label: 'Coverage',
        component: TestTileComponent,
        defaultSize: 'wide',
      },
    ];
    const commandDefinitions: readonly CommandDefinition[] = [
      {
        id: 'return-to-base',
        label: 'Return to Base',
        risk: 'medium',
      },
    ];
    const telemetryStreams: readonly TelemetryStreamDefinition[] = [
      {
        id: 'battery',
        label: 'Battery',
        valueType: 'number',
        unit: '%',
      },
    ];

    TestBed.configureTestingModule({
      providers: [
        { provide: TENANT_CONFIG, useValue: tenant },
        { provide: DASHBOARD_LAYOUT, useValue: layout },
        { provide: NAVIGATION_ITEMS, useValue: navigationItems },
        { provide: DASHBOARD_TILES, useValue: dashboardTiles },
        { provide: COMMAND_DEFINITIONS, useValue: commandDefinitions },
        { provide: TELEMETRY_STREAMS, useValue: telemetryStreams },
      ],
    });

    expect(TestBed.inject(TENANT_CONFIG).id).toBe('custom-tenant');
    expect(TestBed.inject(DASHBOARD_LAYOUT).id).toBe('field-layout');
    expect(TestBed.inject(NAVIGATION_ITEMS)).toBe(navigationItems);
    expect(TestBed.inject(DASHBOARD_TILES)).toBe(dashboardTiles);
    expect(TestBed.inject(COMMAND_DEFINITIONS)).toBe(commandDefinitions);
    expect(TestBed.inject(TELEMETRY_STREAMS)).toBe(telemetryStreams);
  });
});
