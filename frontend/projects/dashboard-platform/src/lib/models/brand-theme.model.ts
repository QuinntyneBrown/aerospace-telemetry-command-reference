export type BrandThemeMode = 'light' | 'dark';

export type BrandDensity = 'compact' | 'comfortable' | 'spacious';

export interface BrandThemePalette {
  readonly primary: string;
  readonly onPrimary: string;
  readonly secondary: string;
  readonly accent: string;
  readonly success: string;
  readonly warning: string;
  readonly danger: string;
  readonly background: string;
  readonly surface: string;
  readonly surfaceAlt: string;
  readonly border: string;
  readonly text: string;
  readonly textMuted: string;
}

export interface BrandThemeTypography {
  readonly fontFamily: string;
  readonly density: BrandDensity;
}

export interface BrandThemeRadii {
  readonly small: string;
  readonly medium: string;
  readonly large: string;
  readonly pill: string;
}

export interface BrandTheme {
  readonly id: string;
  readonly name: string;
  readonly mode: BrandThemeMode;
  readonly palette: BrandThemePalette;
  readonly typography: BrandThemeTypography;
  readonly radii: BrandThemeRadii;
}
