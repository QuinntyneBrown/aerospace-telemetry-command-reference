export type CommandParameterValue = string | number | boolean | null;

export interface CommandRequest {
  readonly id: string;
  readonly commandId: string;
  readonly targetMachineId: string;
  readonly requestedBy: string;
  readonly requestedAt: string;
  readonly parameters?: Readonly<Record<string, CommandParameterValue>>;
  readonly correlationId?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}
