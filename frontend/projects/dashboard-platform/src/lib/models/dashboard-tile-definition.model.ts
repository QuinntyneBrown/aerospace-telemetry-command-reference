import { type Type } from '@angular/core';

export type DashboardTileSize = 'mini' | 'small' | 'medium' | 'large' | 'wide' | 'full';

export interface DashboardTileDefinition {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly component: Type<unknown>;
  readonly defaultSize: DashboardTileSize;
  readonly icon?: string;
  readonly requiredTelemetryStreams?: readonly string[];
  readonly commandIds?: readonly string[];
  readonly featureFlag?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}
