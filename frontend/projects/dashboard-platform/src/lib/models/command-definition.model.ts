export type CommandRisk = 'low' | 'medium' | 'high';

export type CommandParameterType = 'string' | 'number' | 'boolean' | 'enum';

export interface CommandParameterDefinition {
  readonly id: string;
  readonly label: string;
  readonly type: CommandParameterType;
  readonly required?: boolean;
  readonly defaultValue?: string | number | boolean;
  readonly options?: readonly string[];
  readonly min?: number;
  readonly max?: number;
}

export interface CommandDefinition {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly icon?: string;
  readonly category?: string;
  readonly risk: CommandRisk;
  readonly confirmationRequired?: boolean;
  readonly requiredRole?: string;
  readonly machineTypes?: readonly string[];
  readonly parameters?: readonly CommandParameterDefinition[];
  readonly metadata?: Readonly<Record<string, unknown>>;
}
