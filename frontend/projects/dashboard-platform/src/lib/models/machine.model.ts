export type MachineStatus = 'online' | 'offline' | 'degraded' | 'faulted' | 'maintenance';

export interface MachineLocation {
  readonly latitude: number;
  readonly longitude: number;
  readonly altitudeMeters?: number;
  readonly headingDegrees?: number;
}

export interface Machine {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly status: MachineStatus;
  readonly healthPercent?: number;
  readonly location?: MachineLocation;
  readonly batteryPercent?: number;
  readonly temperatureCelsius?: number;
  readonly missionState?: string;
  readonly lastSeenAt: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}
