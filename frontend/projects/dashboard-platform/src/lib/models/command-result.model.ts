export type CommandResultStatus =
  | 'queued'
  | 'accepted'
  | 'rejected'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'timed-out';

export interface CommandResult {
  readonly requestId: string;
  readonly commandId: string;
  readonly targetMachineId: string;
  readonly status: CommandResultStatus;
  readonly message?: string;
  readonly acknowledgedAt?: string;
  readonly completedAt?: string;
  readonly errorCode?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}
