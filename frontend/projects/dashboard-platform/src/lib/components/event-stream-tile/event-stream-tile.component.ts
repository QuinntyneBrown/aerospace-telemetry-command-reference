import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { map } from 'rxjs';
import { type ViamEventItem, ViamEventStreamComponent } from 'white-label-ui';

import { TELEMETRY_STREAM_SERVICE } from '../../contracts';
import {
  type DashboardEvent,
  type DashboardTileDefinition,
  type TelemetrySample,
  type TelemetryValue,
} from '../../models';
import { TELEMETRY_STREAMS } from '../../tokens';

@Component({
  selector: 'viam-platform-event-stream-tile',
  standalone: true,
  imports: [AsyncPipe, ViamEventStreamComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-stream-tile.component.html',
  styleUrl: './event-stream-tile.component.scss',
})
export class EventStreamTileComponent {
  @Input({ required: true }) definition!: DashboardTileDefinition;

  private readonly streams = inject(TELEMETRY_STREAMS);
  private readonly telemetry = inject(TELEMETRY_STREAM_SERVICE);

  protected readonly events$ = this.telemetry.samples().pipe(map((samples) => this.resolveEvents(samples)));

  protected get subtitle(): string {
    return (
      (this.definition.metadata?.['subtitle'] as string | undefined) ??
      'Latest telemetry events'
    );
  }

  private resolveEvents(samples: readonly TelemetrySample[]): readonly ViamEventItem[] {
    const liveEvents = samples
      .filter((sample) => this.isVisible(sample))
      .slice(-8)
      .reverse()
      .map((sample) => this.sampleToEvent(sample));

    return liveEvents.length > 0 ? liveEvents : this.configuredEvents;
  }

  private get configuredEvents(): readonly ViamEventItem[] {
    const configured =
      (this.definition.metadata?.['events'] as readonly DashboardEvent[] | undefined) ?? [];

    return configured.map((event) => ({
      title: event.title,
      detail: event.detail,
      time: event.time,
      icon: event.icon,
      color: this.toneColor(event.tone),
    }));
  }

  private isVisible(sample: TelemetrySample): boolean {
    const streamIds =
      this.definition.requiredTelemetryStreams ??
      (this.definition.metadata?.['streamIds'] as readonly string[] | undefined);

    return !streamIds?.length || streamIds.includes(sample.streamId);
  }

  private sampleToEvent(sample: TelemetrySample): ViamEventItem {
    const stream = this.streams.find((candidate) => candidate.id === sample.streamId);

    return {
      title: stream?.label ?? sample.streamId,
      detail: `${sample.machineId}: ${this.formatValue(sample.value, sample.unit)}`,
      time: this.formatTime(sample.timestamp),
      icon: stream?.icon ?? 'sensors',
      color: stream?.color ?? 'var(--viam-info, #8be7ff)',
    };
  }

  private formatValue(value: TelemetryValue, unit: string | undefined): string {
    if (typeof value === 'number') {
      return `${Math.round(value * 10) / 10}${unit ? ` ${unit}` : ''}`;
    }

    if (typeof value === 'string' || typeof value === 'boolean') {
      return `${value}`;
    }

    return 'structured telemetry';
  }

  private formatTime(timestamp: string): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(timestamp));
  }

  private toneColor(tone: DashboardEvent['tone']): string {
    switch (tone) {
      case 'success':
        return 'var(--viam-success, #4fe3a4)';
      case 'warning':
        return 'var(--viam-warning, #ffd166)';
      case 'danger':
        return 'var(--viam-danger, #ff687e)';
      case 'info':
        return 'var(--viam-info, #8be7ff)';
      case 'neutral':
        return 'var(--viam-muted, #8793a0)';
    }
  }
}
