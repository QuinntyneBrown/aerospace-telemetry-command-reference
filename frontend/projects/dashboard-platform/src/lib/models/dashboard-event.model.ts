export type DashboardEventTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export interface DashboardEvent {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly time: string;
  readonly icon: string;
  readonly tone: DashboardEventTone;
}
