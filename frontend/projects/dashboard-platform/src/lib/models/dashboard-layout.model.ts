import { type DashboardTileSize } from './dashboard-tile-definition.model';

export type DashboardLayoutDensity = 'compact' | 'comfortable' | 'spacious';

export interface DashboardTilePlacement {
  readonly id: string;
  readonly tileId: string;
  readonly size: DashboardTileSize;
  readonly order: number;
  readonly column?: number;
  readonly row?: number;
  readonly config?: Readonly<Record<string, unknown>>;
}

export interface DashboardLayout {
  readonly id: string;
  readonly label: string;
  readonly columns: number;
  readonly density: DashboardLayoutDensity;
  readonly tiles: readonly DashboardTilePlacement[];
  readonly metadata?: Readonly<Record<string, unknown>>;
}
