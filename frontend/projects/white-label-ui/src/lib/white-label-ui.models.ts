export type ViamTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export type ViamButtonType = 'button' | 'submit' | 'reset';

export type ViamTileSize = 'mini' | 'small' | 'medium' | 'large' | 'wide' | 'full';

export interface ViamSelectOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
}

export interface ViamRailItem {
  readonly label: string;
  readonly icon: string;
  readonly value: string;
  readonly active?: boolean;
  readonly disabled?: boolean;
}

export interface ViamFleetRow {
  readonly name: string;
  readonly detail: string;
  readonly state: string;
  readonly battery: string;
  readonly temperature: string;
  readonly color?: string;
}

export interface ViamCommandAction {
  readonly label: string;
  readonly icon: string;
  readonly value: string;
  readonly color?: string;
  readonly disabled?: boolean;
}

export interface ViamKeyValueItem {
  readonly label: string;
  readonly value: string;
}

export interface ViamMapNode {
  readonly icon: string;
  readonly left: string;
  readonly top: string;
  readonly color?: string;
  readonly label?: string;
}

export interface ViamEventItem {
  readonly icon: string;
  readonly title: string;
  readonly detail: string;
  readonly time: string;
  readonly color?: string;
}

export const VIAM_TILE_SIZE_OPTIONS: readonly ViamSelectOption[] = [
  { value: 'mini', label: 'Mini' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'wide', label: 'Wide' },
  { value: 'full', label: 'Full' },
];
