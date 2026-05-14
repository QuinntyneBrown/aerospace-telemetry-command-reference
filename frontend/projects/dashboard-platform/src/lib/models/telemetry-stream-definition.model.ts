export type TelemetryValueType = 'number' | 'string' | 'boolean' | 'enum' | 'location' | 'json';

export interface TelemetryThreshold {
  readonly warning?: number;
  readonly critical?: number;
}

export interface TelemetryStreamDefinition {
  readonly id: string;
  readonly label: string;
  readonly valueType: TelemetryValueType;
  readonly machineType?: string;
  readonly unit?: string;
  readonly description?: string;
  readonly icon?: string;
  readonly color?: string;
  readonly sampleKey?: string;
  readonly precision?: number;
  readonly thresholds?: TelemetryThreshold;
  readonly metadata?: Readonly<Record<string, unknown>>;
}
