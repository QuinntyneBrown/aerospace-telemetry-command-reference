import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { map } from 'rxjs';
import { type ViamFleetRow, ViamFleetTableComponent } from 'white-label-ui';

import { TELEMETRY_STREAM_SERVICE } from '../../contracts';
import { type DashboardTileDefinition, type Machine } from '../../models';

@Component({
  selector: 'viam-platform-machine-table-tile',
  standalone: true,
  imports: [AsyncPipe, ViamFleetTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './machine-table-tile.component.html',
  styleUrl: './machine-table-tile.component.scss',
})
export class MachineTableTileComponent {
  @Input({ required: true }) definition!: DashboardTileDefinition;

  private readonly telemetry = inject(TELEMETRY_STREAM_SERVICE);

  protected readonly rows$ = this.telemetry
    .machines()
    .pipe(
      map((machines) => this.configuredRows() ?? machines.map((machine) => this.toRow(machine))),
    );

  protected get subtitle(): string {
    return (
      (this.definition.metadata?.['subtitle'] as string | undefined) ??
      'Live machine health and mission state'
    );
  }

  private configuredRows(): readonly ViamFleetRow[] | null {
    const rows = this.definition.metadata?.['rows'] as readonly ViamFleetRow[] | undefined;
    return rows?.length ? rows : null;
  }

  private toRow(machine: Machine): ViamFleetRow {
    return {
      name: machine.name,
      detail: `${machine.type} / ${machine.missionState ?? 'Standby'}`,
      state: machine.status,
      battery: this.formatPercent(machine.batteryPercent),
      temperature: this.formatTemperature(machine.temperatureCelsius),
      color: this.statusColor(machine.status),
    };
  }

  private formatPercent(value: number | undefined): string {
    return typeof value === 'number' ? `${Math.round(value)}%` : 'n/a';
  }

  private formatTemperature(value: number | undefined): string {
    return typeof value === 'number' ? `${Math.round(value)} C` : 'n/a';
  }

  private statusColor(status: Machine['status']): string {
    switch (status) {
      case 'online':
        return 'var(--viam-success, #4fe3a4)';
      case 'degraded':
      case 'maintenance':
        return 'var(--viam-warning, #ffd166)';
      case 'faulted':
      case 'offline':
        return 'var(--viam-danger, #ff687e)';
    }
  }
}
