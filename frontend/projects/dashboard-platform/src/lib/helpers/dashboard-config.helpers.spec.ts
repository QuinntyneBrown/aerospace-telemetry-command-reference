import { describe, expect, expectTypeOf, it } from 'vitest';

import { DEFAULT_BRAND_THEME, DEFAULT_DASHBOARD_LAYOUT, DEFAULT_TENANT_CONFIG } from '../defaults';
import { type BrandTheme, type DashboardLayout, type TenantConfig } from '../models';
import {
  createDashboardPlatformConfig,
  type DashboardPlatformConfig,
  mergeBrandTheme,
  mergeDashboardLayout,
  mergeTenantConfig,
  sortNavigationItems,
} from './dashboard-config.helpers';

class TestTileComponent {}

describe('dashboard config helpers', () => {
  it('merges brand theme overrides without dropping default nested tokens', () => {
    const theme = mergeBrandTheme(DEFAULT_BRAND_THEME, {
      id: 'custom-dark',
      palette: {
        primary: '#ffffff',
      },
      typography: {
        density: 'compact',
      },
    });

    expectTypeOf(theme).toMatchTypeOf<BrandTheme>();
    expect(theme.id).toBe('custom-dark');
    expect(theme.palette.primary).toBe('#ffffff');
    expect(theme.palette.onPrimary).toBe(DEFAULT_BRAND_THEME.palette.onPrimary);
    expect(theme.typography.density).toBe('compact');
    expect(theme.typography.fontFamily).toBe(DEFAULT_BRAND_THEME.typography.fontFamily);
  });

  it('merges tenant config overrides with default terminology, feature, metadata, and theme values', () => {
    const tenant = mergeTenantConfig(DEFAULT_TENANT_CONFIG, {
      id: 'custom-tenant',
      displayName: 'Custom Tenant',
      terminology: {
        machine: 'AMR',
      },
      features: {
        commands: true,
      },
      metadata: {
        region: 'yard-a',
      },
      theme: {
        palette: {
          accent: '#ffcc66',
        },
      },
    });

    expectTypeOf(tenant).toMatchTypeOf<TenantConfig>();
    expect(tenant.id).toBe('custom-tenant');
    expect(tenant.displayName).toBe('Custom Tenant');
    expect(tenant.productName).toBe(DEFAULT_TENANT_CONFIG.productName);
    expect(tenant.terminology['machine']).toBe('AMR');
    expect(tenant.terminology['telemetry']).toBe(DEFAULT_TENANT_CONFIG.terminology['telemetry']);
    expect(tenant.features['commands']).toBe(true);
    expect(tenant.metadata['region']).toBe('yard-a');
    expect(tenant.theme.palette.accent).toBe('#ffcc66');
    expect(tenant.theme.palette.primary).toBe(DEFAULT_BRAND_THEME.palette.primary);
  });

  it('merges dashboard layout overrides and preserves default metadata', () => {
    const layout = mergeDashboardLayout(
      {
        ...DEFAULT_DASHBOARD_LAYOUT,
        metadata: {
          source: 'default',
        },
      },
      {
        columns: 6,
        tiles: [
          {
            id: 'fleet-main',
            tileId: 'fleet',
            size: 'wide',
            order: 1,
          },
        ],
        metadata: {
          variant: 'compact',
        },
      },
    );

    expectTypeOf(layout).toMatchTypeOf<DashboardLayout>();
    expect(layout.columns).toBe(6);
    expect(layout.tiles).toHaveLength(1);
    expect(layout.metadata?.['source']).toBe('default');
    expect(layout.metadata?.['variant']).toBe('compact');
  });

  it('sorts navigation items by order and then label', () => {
    const sorted = sortNavigationItems([
      { id: 'commands', label: 'Commands', route: '/commands', order: 2 },
      { id: 'fleet', label: 'Fleet', route: '/fleet', order: 1 },
      { id: 'alerts', label: 'Alerts', route: '/alerts', order: 1 },
    ]);

    expect(sorted.map((item) => item.id)).toEqual(['alerts', 'fleet', 'commands']);
  });

  it('creates a complete platform config from partial dashboard inputs', () => {
    const config = createDashboardPlatformConfig({
      tenant: {
        name: 'Custom Tenant',
      },
      navigationItems: [
        { id: 'telemetry', label: 'Telemetry', route: '/telemetry', order: 2 },
        { id: 'fleet', label: 'Fleet', route: '/fleet', order: 1 },
      ],
      dashboardTiles: [
        {
          id: 'fleet-health',
          label: 'Fleet Health',
          component: TestTileComponent,
          defaultSize: 'wide',
          requiredTelemetryStreams: ['health'],
        },
      ],
    });

    expectTypeOf(config).toMatchTypeOf<DashboardPlatformConfig>();
    expect(config.tenant.name).toBe('Custom Tenant');
    expect(config.navigationItems.map((item) => item.id)).toEqual(['fleet', 'telemetry']);
    expect(config.dashboardLayout.id).toBe(DEFAULT_DASHBOARD_LAYOUT.id);
    expect(config.dashboardTiles).toHaveLength(1);
    expect(config.commandDefinitions).toEqual([]);
    expect(config.telemetryStreams).toEqual([]);
  });
});
