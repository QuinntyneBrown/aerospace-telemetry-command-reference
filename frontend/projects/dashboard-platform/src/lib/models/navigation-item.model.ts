export interface NavigationItem {
  readonly id: string;
  readonly label: string;
  readonly route: string;
  readonly icon?: string;
  readonly order?: number;
  readonly disabled?: boolean;
  readonly children?: readonly NavigationItem[];
  readonly metadata?: Readonly<Record<string, unknown>>;
}
