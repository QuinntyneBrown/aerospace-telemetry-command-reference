import {
  DEFAULT_BRAND_THEME,
  DEFAULT_DASHBOARD_LAYOUT,
  DEFAULT_NAVIGATION_ITEMS,
  DEFAULT_TENANT_CONFIG,
} from '../defaults';
import {
  type BrandTheme,
  type CommandDefinition,
  type DashboardLayout,
  type DashboardTileDefinition,
  type NavigationItem,
  type TelemetryStreamDefinition,
  type TenantConfig,
} from '../models';

export type BrandThemeInput = Partial<Omit<BrandTheme, 'palette' | 'typography' | 'radii'>> & {
  readonly palette?: Partial<BrandTheme['palette']>;
  readonly typography?: Partial<BrandTheme['typography']>;
  readonly radii?: Partial<BrandTheme['radii']>;
};

export type TenantConfigInput = Partial<Omit<TenantConfig, 'theme'>> & {
  readonly theme?: BrandThemeInput;
};

export type DashboardLayoutInput = Partial<Omit<DashboardLayout, 'tiles' | 'metadata'>> & {
  readonly tiles?: DashboardLayout['tiles'];
  readonly metadata?: Readonly<Record<string, unknown>>;
};

export interface DashboardPlatformConfig {
  readonly tenant: TenantConfig;
  readonly navigationItems: readonly NavigationItem[];
  readonly dashboardLayout: DashboardLayout;
  readonly dashboardTiles: readonly DashboardTileDefinition[];
  readonly commandDefinitions: readonly CommandDefinition[];
  readonly telemetryStreams: readonly TelemetryStreamDefinition[];
}

export interface DashboardPlatformConfigInput {
  readonly tenant?: TenantConfigInput;
  readonly navigationItems?: readonly NavigationItem[];
  readonly dashboardLayout?: DashboardLayoutInput;
  readonly dashboardTiles?: readonly DashboardTileDefinition[];
  readonly commandDefinitions?: readonly CommandDefinition[];
  readonly telemetryStreams?: readonly TelemetryStreamDefinition[];
}

export function mergeBrandTheme(
  base: BrandTheme = DEFAULT_BRAND_THEME,
  override: BrandThemeInput = {},
): BrandTheme {
  return {
    ...base,
    ...override,
    palette: {
      ...base.palette,
      ...override.palette,
    },
    typography: {
      ...base.typography,
      ...override.typography,
    },
    radii: {
      ...base.radii,
      ...override.radii,
    },
  };
}

export function mergeTenantConfig(
  base: TenantConfig = DEFAULT_TENANT_CONFIG,
  override: TenantConfigInput = {},
): TenantConfig {
  return {
    ...base,
    ...override,
    theme: mergeBrandTheme(base.theme, override.theme),
    terminology: {
      ...base.terminology,
      ...override.terminology,
    },
    features: {
      ...base.features,
      ...override.features,
    },
    metadata: {
      ...base.metadata,
      ...override.metadata,
    },
  };
}

export function mergeDashboardLayout(
  base: DashboardLayout = DEFAULT_DASHBOARD_LAYOUT,
  override: DashboardLayoutInput = {},
): DashboardLayout {
  return {
    ...base,
    ...override,
    tiles: override.tiles ?? base.tiles,
    metadata: {
      ...base.metadata,
      ...override.metadata,
    },
  };
}

export function sortNavigationItems(items: readonly NavigationItem[]): readonly NavigationItem[] {
  return [...items].sort((left, right) => {
    const orderComparison = (left.order ?? 0) - (right.order ?? 0);

    if (orderComparison !== 0) {
      return orderComparison;
    }

    return left.label.localeCompare(right.label);
  });
}

export function createDashboardPlatformConfig(
  input: DashboardPlatformConfigInput = {},
): DashboardPlatformConfig {
  return {
    tenant: mergeTenantConfig(DEFAULT_TENANT_CONFIG, input.tenant),
    navigationItems: sortNavigationItems(input.navigationItems ?? DEFAULT_NAVIGATION_ITEMS),
    dashboardLayout: mergeDashboardLayout(DEFAULT_DASHBOARD_LAYOUT, input.dashboardLayout),
    dashboardTiles: input.dashboardTiles ?? [],
    commandDefinitions: input.commandDefinitions ?? [],
    telemetryStreams: input.telemetryStreams ?? [],
  };
}
