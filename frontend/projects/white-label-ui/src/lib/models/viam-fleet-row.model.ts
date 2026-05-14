export interface ViamFleetRow {
  readonly name: string;
  readonly detail: string;
  readonly state: string;
  readonly battery: string;
  readonly temperature: string;
  readonly color?: string;
}
