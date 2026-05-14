import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { map } from 'rxjs';
import { type ViamMapNode, ViamSiteMapComponent } from 'white-label-ui';

import { TELEMETRY_STREAM_SERVICE } from '../../contracts';
import { type DashboardTileDefinition, type Machine } from '../../models';

@Component({
  selector: 'viam-platform-operating-area-tile',
  standalone: true,
  imports: [AsyncPipe, ViamSiteMapComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './operating-area-tile.component.html',
  styleUrl: './operating-area-tile.component.scss',
})
export class OperatingAreaTileComponent {
  @Input({ required: true }) definition!: DashboardTileDefinition;

  private readonly telemetry = inject(TELEMETRY_STREAM_SERVICE);

  protected readonly machines$ = this.telemetry.machines();
  protected readonly nodes$ = this.machines$.pipe(map((machines) => this.resolveNodes(machines)));

  protected get subtitle(): string {
    return (
      (this.definition.metadata?.['subtitle'] as string | undefined) ??
      'Mission corridor and active machines'
    );
  }

  protected meta(machines: readonly Machine[] | null): string {
    return machines?.length
      ? `${machines.length} live nodes`
      : ((this.definition.metadata?.['meta'] as string | undefined) ?? '');
  }

  private resolveNodes(machines: readonly Machine[]): readonly ViamMapNode[] {
    const machinesWithLocation = machines.filter((machine) => machine.location);

    if (machinesWithLocation.length === 0) {
      return (this.definition.metadata?.['nodes'] as readonly ViamMapNode[] | undefined) ?? [];
    }

    const latitudes = machinesWithLocation.map((machine) => machine.location!.latitude);
    const longitudes = machinesWithLocation.map((machine) => machine.location!.longitude);
    const minLatitude = Math.min(...latitudes);
    const maxLatitude = Math.max(...latitudes);
    const minLongitude = Math.min(...longitudes);
    const maxLongitude = Math.max(...longitudes);

    return machinesWithLocation.map((machine, index) => ({
      icon: this.iconForMachine(machine),
      left: this.percentWithin(machine.location!.longitude, minLongitude, maxLongitude, index),
      top: this.percentWithin(maxLatitude - machine.location!.latitude, 0, maxLatitude - minLatitude, index),
      label: machine.name,
      color: this.colorForStatus(machine.status),
    }));
  }

  private percentWithin(value: number, min: number, max: number, index: number): string {
    if (Math.abs(max - min) < 0.000001) {
      return `${42 + index * 12}%`;
    }

    const normalized = (value - min) / (max - min);
    return `${Math.round(18 + normalized * 64)}%`;
  }

  private iconForMachine(machine: Machine): string {
    const description = `${machine.name} ${machine.type}`.toLowerCase();

    if (description.includes('field') || description.includes('rover')) {
      return 'agriculture';
    }

    if (description.includes('dock') || description.includes('amr') || description.includes('tug')) {
      return 'forklift';
    }

    return 'robot_2';
  }

  private colorForStatus(status: Machine['status']): string {
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
