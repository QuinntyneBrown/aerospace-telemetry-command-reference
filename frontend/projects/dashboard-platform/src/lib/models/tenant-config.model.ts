import { type BrandTheme } from './brand-theme.model';

export interface TenantConfig {
  readonly id: string;
  readonly name: string;
  readonly displayName: string;
  readonly productName: string;
  readonly description?: string;
  readonly logoText: string;
  readonly theme: BrandTheme;
  readonly terminology: Readonly<Record<string, string>>;
  readonly features: Readonly<Record<string, boolean>>;
  readonly metadata: Readonly<Record<string, unknown>>;
}
