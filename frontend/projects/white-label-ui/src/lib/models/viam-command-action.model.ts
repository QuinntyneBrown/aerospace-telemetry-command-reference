export interface ViamCommandAction {
  readonly label: string;
  readonly icon: string;
  readonly value: string;
  readonly color?: string;
  readonly disabled?: boolean;
}
