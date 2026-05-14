import { type MachineLocation } from './machine.model';

export type TelemetryValue =
  | string
  | number
  | boolean
  | MachineLocation
  | readonly unknown[]
  | Readonly<Record<string, unknown>>
  | null;

export type TelemetryQuality = 'good' | 'stale' | 'estimated' | 'invalid';

export interface TelemetrySample {
  readonly id: string;
  readonly streamId: string;
  readonly machineId: string;
  readonly timestamp: string;
  readonly value: TelemetryValue;
  readonly unit?: string;
  readonly quality?: TelemetryQuality;
  readonly metadata?: Readonly<Record<string, unknown>>;
}
