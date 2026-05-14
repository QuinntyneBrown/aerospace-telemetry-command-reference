import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';

import { TELEMETRY_STREAM_SERVICE } from '../../contracts';
import { type ChartData, type DashboardTileDefinition, type TelemetrySample } from '../../models';
import { TELEMETRY_STREAMS } from '../../tokens';
import { ChartJsPanelComponent } from '../chart-js-panel/chart-js-panel.component';

@Component({
  selector: 'viam-platform-telemetry-chart-tile',
  standalone: true,
  imports: [AsyncPipe, ChartJsPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './telemetry-chart-tile.component.html',
  styleUrl: './telemetry-chart-tile.component.scss',
})
export class TelemetryChartTileComponent {
  @Input({ required: true }) definition!: DashboardTileDefinition;

  private readonly telemetry = inject(TELEMETRY_STREAM_SERVICE);
  private readonly telemetryStreams = inject(TELEMETRY_STREAMS);

  protected readonly samples$ = this.telemetry.samples();

  protected chartData(samples: readonly TelemetrySample[] | null): ChartData {
    const streamIds = this.definition.requiredTelemetryStreams ?? [];
    const relevantSamples = (samples ?? []).filter((sample) => {
      return (
        typeof sample.value === 'number' &&
        (streamIds.length === 0 || streamIds.includes(sample.streamId))
      );
    });

    if (relevantSamples.length >= 2) {
      return this.liveChartData(relevantSamples, streamIds);
    }

    return (
      (this.definition.metadata?.['chartData'] as ChartData | undefined) ?? {
        labels: [],
        series: [],
      }
    );
  }

  private liveChartData(
    samples: readonly TelemetrySample[],
    configuredStreamIds: readonly string[],
  ): ChartData {
    const streamIds =
      configuredStreamIds.length > 0
        ? configuredStreamIds
        : [...new Set(samples.map((sample) => sample.streamId))];

    const series = streamIds
      .map((streamId) => {
        const stream = this.telemetryStreams.find((candidate) => candidate.id === streamId);
        const values = samples
          .filter((sample) => sample.streamId === streamId && typeof sample.value === 'number')
          .slice(-12)
          .map((sample) => Number(sample.value));

        return {
          label: stream?.label ?? streamId,
          color: stream?.color ?? '#63d7ff',
          values,
        };
      })
      .filter((item) => item.values.length > 0);

    const length = Math.max(...series.map((item) => item.values.length), 0);

    return {
      labels: Array.from({ length }, (_, index) =>
        index === length - 1 ? 'now' : `-${(length - index - 1) * 2}s`,
      ),
      series,
    };
  }

  protected get subtitle(): string {
    return (
      (this.definition.metadata?.['subtitle'] as string | undefined) ??
      'Rolling telemetry samples'
    );
  }
}
