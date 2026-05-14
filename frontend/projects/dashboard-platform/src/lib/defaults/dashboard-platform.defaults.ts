import {
  type BrandTheme,
  type DashboardLayout,
  type NavigationItem,
  type TenantConfig,
} from '../models';

export const DEFAULT_BRAND_THEME: BrandTheme = {
  id: 'default-dark',
  name: 'Default Dark',
  mode: 'dark',
  palette: {
    primary: '#8be7ff',
    onPrimary: '#061019',
    secondary: '#4fe3a4',
    accent: '#ffb45f',
    success: '#4fe3a4',
    warning: '#ffd166',
    danger: '#ff687e',
    background: '#060b11',
    surface: '#121b24',
    surfaceAlt: '#182431',
    border: 'rgba(255, 255, 255, 0.1)',
    text: '#f3f7fb',
    textMuted: '#8793a0',
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    density: 'comfortable',
  },
  radii: {
    small: '4px',
    medium: '8px',
    large: '12px',
    pill: '999px',
  },
};

export const DEFAULT_TENANT_CONFIG: TenantConfig = {
  id: 'white-label',
  name: 'White Label Operations',
  displayName: 'White Label Operations',
  productName: 'Operations Console',
  description: 'Reusable telemetry and command dashboard platform.',
  logoText: 'WL',
  theme: DEFAULT_BRAND_THEME,
  terminology: {
    machine: 'Machine',
    machines: 'Machines',
    telemetry: 'Telemetry',
    command: 'Command',
    commands: 'Commands',
  },
  features: {},
  metadata: {},
};

export const DEFAULT_DASHBOARD_LAYOUT: DashboardLayout = {
  id: 'default-layout',
  label: 'Default Layout',
  columns: 12,
  density: 'comfortable',
  tiles: [],
  metadata: {},
};

export const DEFAULT_NAVIGATION_ITEMS: readonly NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    route: '/',
    icon: 'space_dashboard',
    order: 0,
  },
];
