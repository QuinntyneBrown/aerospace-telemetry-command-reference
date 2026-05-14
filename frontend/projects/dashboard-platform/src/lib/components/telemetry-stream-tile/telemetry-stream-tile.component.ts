import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { map } from 'rxjs';
import { type ViamEventItem, ViamEventStreamComponent } from 'white-label-ui';

import { TELEMETRY_STREAM_SERVICE } from '../../contracts';
import {
  type DashboardTileDefinition,
  type TelemetrySample,
  type TelemetryStreamDefinition,
  type TelemetryValue,
} from '../../models';
import { TELEMETRY_STREAMS } from '../../tokens';

@Component({
  selector: 'viam-platform-telemetry-stream-tile',
  standalone: true,
  imports: [AsyncPipe, ViamEventStreamComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './telemetry-stream-tile.component.html',
  styleUrl: './telemetry-stream-tile.component.scss',
})
export class TelemetryStreamTileComponent {
  @Input({ required: true }) definition!: DashboardTileDefinition;

  private readonly streams = inject(TELEMETRY_STREAMS);
  private readonly telemetry = inject(TELEMETRY_STREAM_SERVICE);

  protected readonly events$ = this.telemetry
    .samples()
    .pipe(
      map((samples) =>
        samples.filter((sample) => this.isVisible(sample)).map((sample) => this.toEvent(sample)),
      ),
    );

  protected get subtitle(): string {
    return (
      (this.definition.metadata?.['subtitle'] as string | undefined) ?? 'Recent telemetry samples'
    );
  }

  private isVisible(sample: TelemetrySample): boolean {
    const streamIds =
      this.definition.requiredTelemetryStreams ??
      (this.definition.metadata?.['streamIds'] as readonly string[] | undefined);

    return !streamIds?.length || streamIds.includes(sample.streamId);
  }

  private toEvent(sample: TelemetrySample): ViamEventItem {
    const stream = this.streams.find((item) => item.id === sample.streamId);

    return {
      icon: stream?.icon ?? 'sensors',
      title: stream?.label ?? sample.streamId,
      detail: `${sample.machineId}: ${this.formatValue(sample.value, sample.unit)}`,
      time: this.formatTime(sample.timestamp),
      color: stream?.color ?? 'var(--viam-info, #8be7ff)',
    };
  }

  private formatValue(value: TelemetryValue, unit: string | undefined): string {
    if (typeof value === 'number') {
      return `${Math.round(value * 10) / 10}${unit ? ` ${unit}` : ''}`;
    }

    if (typeof value === 'string' || typeof value === 'boolean') {
      return `${value}${unit ? ` ${unit}` : ''}`;
    }

    return unit ? `structured ${unit}` : 'structured payload';
  }

  private formatTime(timestamp: string): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(timestamp));
  }
}
