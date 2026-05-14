import { ChangeDetectionStrategy, Component, Input, inject, signal } from '@angular/core';
import { take } from 'rxjs';
import {
  type ViamCommandAction,
  type ViamKeyValueItem,
  ViamCommandCenterComponent,
} from 'white-label-ui';

import { COMMAND_DISPATCH_SERVICE } from '../../contracts';
import {
  type CommandDefinition,
  type CommandParameterValue,
  type CommandRequest,
  type DashboardTileDefinition,
} from '../../models';
import { COMMAND_DEFINITIONS } from '../../tokens';

@Component({
  selector: 'viam-platform-command-center-tile',
  standalone: true,
  imports: [ViamCommandCenterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './command-center-tile.component.html',
  styleUrl: './command-center-tile.component.scss',
})
export class CommandCenterTileComponent {
  @Input({ required: true }) definition!: DashboardTileDefinition;

  private readonly commandDefinitions = inject(COMMAND_DEFINITIONS);
  private readonly commandDispatch = inject(COMMAND_DISPATCH_SERVICE);

  protected readonly lastResult = signal('Ready for operator command');

  protected get commands(): readonly ViamCommandAction[] {
    return this.filteredCommands().map((command) => ({
      label: command.label,
      icon: command.icon ?? 'terminal',
      value: command.id,
      color: this.riskColor(command.risk),
      disabled: command.metadata?.['disabled'] === true,
    }));
  }

  protected get keyValues(): readonly ViamKeyValueItem[] {
    return [
      { label: 'Registered', value: `${this.filteredCommands().length}` },
      { label: 'Last result', value: this.lastResult() },
    ];
  }

  protected onCommandSelected(commandId: string): void {
    const command = this.commandDefinitions.find((item) => item.id === commandId);

    if (!command) {
      this.lastResult.set('Command unavailable');
      return;
    }

    const request: CommandRequest = {
      id: `command-${Date.now()}`,
      commandId: command.id,
      targetMachineId: this.targetMachineId(command),
      requestedBy: 'demo-operator',
      requestedAt: new Date().toISOString(),
      parameters: this.defaultParameters(command),
      metadata: {
        sourceTileId: this.definition.id,
      },
    };

    this.lastResult.set(`Dispatching ${command.label}`);
    this.commandDispatch
      .dispatch(request)
      .pipe(take(1))
      .subscribe({
        next: (result) => this.lastResult.set(`${command.label}: ${result.status}`),
        error: () => this.lastResult.set(`${command.label}: failed`),
      });
  }

  private filteredCommands(): readonly CommandDefinition[] {
    const commandIds =
      this.definition.commandIds ??
      (this.definition.metadata?.['commandIds'] as readonly string[] | undefined);

    if (!commandIds?.length) {
      return this.commandDefinitions;
    }

    return this.commandDefinitions.filter((command) => commandIds.includes(command.id));
  }

  private targetMachineId(command: CommandDefinition): string {
    return (command.metadata?.['defaultMachineId'] as string | undefined) ?? 'fleet';
  }

  private defaultParameters(command: CommandDefinition): CommandRequest['parameters'] {
    const parameters: Record<string, CommandParameterValue> = {};

    for (const parameter of command.parameters ?? []) {
      if (parameter.defaultValue !== undefined) {
        parameters[parameter.id] = parameter.defaultValue;
      }
    }

    return parameters;
  }

  private riskColor(risk: CommandDefinition['risk']): string {
    switch (risk) {
      case 'low':
        return 'var(--viam-success, #4fe3a4)';
      case 'medium':
        return 'var(--viam-warning, #ffd166)';
      case 'high':
        return 'var(--viam-danger, #ff687e)';
    }
  }
}
