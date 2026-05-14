import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { ViamMetricCardComponent, type ViamTone } from 'white-label-ui';

import { TELEMETRY_STREAM_SERVICE } from '../../contracts';
import {
  type DashboardTileDefinition,
  type Machine,
  type TelemetrySample,
  type TelemetryValue,
} from '../../models';

interface MetricTileItem {
  readonly label: string;
  readonly value: string;
  readonly trend?: string;
  readonly trendIcon?: string;
  readonly tone?: ViamTone;
  readonly icon?: string;
  readonly color?: string;
  readonly streamId?: string;
  readonly machineMetric?:
    | 'totalMachines'
    | 'onlineCount'
    | 'activeMissions'
    | 'alerts'
    | 'averageBattery';
  readonly unit?: string;
  readonly precision?: number;
}

@Component({
  selector: 'viam-platform-metric-summary-tile',
  standalone: true,
  imports: [AsyncPipe, ViamMetricCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './metric-summary-tile.component.html',
  styleUrl: './metric-summary-tile.component.scss',
})
export class MetricSummaryTileComponent {
  @Input({ required: true }) definition!: DashboardTileDefinition;

  private readonly telemetry = inject(TELEMETRY_STREAM_SERVICE);

  protected readonly metrics$ = combineLatest([
    this.telemetry.samples(),
    this.telemetry.machines(),
  ]).pipe(map(([samples, machines]) => this.resolveMetrics(samples, machines)));

  private get configuredMetrics(): readonly MetricTileItem[] {
    return (this.definition.metadata?.['metrics'] as readonly MetricTileItem[] | undefined) ?? [];
  }

  private resolveMetrics(
    samples: readonly TelemetrySample[],
    machines: readonly Machine[],
  ): readonly MetricTileItem[] {
    return this.configuredMetrics.map((metric) => ({
      ...metric,
      ...this.resolveLiveMetric(metric, samples, machines),
    }));
  }

  private resolveLiveMetric(
    metric: MetricTileItem,
    samples: readonly TelemetrySample[],
    machines: readonly Machine[],
  ): Partial<MetricTileItem> {
    if (metric.machineMetric) {
      return this.resolveMachineMetric(metric, machines);
    }

    if (!metric.streamId) {
      return {};
    }

    const streamSamples = samples
      .filter((sample) => sample.streamId === metric.streamId)
      .slice(-2);
    const latest = streamSamples.at(-1);

    if (!latest) {
      return {};
    }

    const previous = streamSamples.at(-2);
    const value = this.formatTelemetryValue(latest.value, metric.unit ?? latest.unit, metric.precision);
    const trend =
      typeof latest.value === 'number' && typeof previous?.value === 'number'
        ? this.formatTrend(latest.value - previous.value, metric.unit ?? latest.unit, metric.precision)
        : metric.trend;

    return {
      value,
      trend,
      tone: this.toneForDelta(
        typeof latest.value === 'number' && typeof previous?.value === 'number'
          ? latest.value - previous.value
          : 0,
        metric.tone,
      ),
    };
  }

  private resolveMachineMetric(
    metric: MetricTileItem,
    machines: readonly Machine[],
  ): Partial<MetricTileItem> {
    if (machines.length === 0) {
      return {};
    }

    switch (metric.machineMetric) {
      case 'totalMachines':
        return { value: String(machines.length), trend: metric.trend };
      case 'onlineCount':
        return {
          value: String(machines.filter((machine) => machine.status === 'online').length),
          trend: `${machines.length} total`,
        };
      case 'activeMissions':
        return {
          value: String(
            machines.filter((machine) => {
              const mission = machine.missionState?.toLowerCase() ?? '';
              return mission.length > 0 && mission !== 'standby' && mission !== 'docked';
            }).length,
          ),
          trend: metric.trend,
        };
      case 'alerts':
        return {
          value: String(
            machines.filter((machine) =>
              ['degraded', 'faulted', 'offline', 'maintenance'].includes(machine.status),
            ).length,
          ),
          tone: 'warning',
          trend: metric.trend,
        };
      case 'averageBattery': {
        const batteries = machines
          .map((machine) => machine.batteryPercent)
          .filter((value): value is number => typeof value === 'number');
        const average =
          batteries.length === 0
            ? undefined
            : batteries.reduce((total, value) => total + value, 0) / batteries.length;

        return average === undefined
          ? {}
          : { value: this.formatNumber(average, 0, '%'), trend: `${batteries.length} machines` };
      }
    }

    return {};
  }

  private formatTelemetryValue(
    value: TelemetryValue,
    unit: string | undefined,
    precision = 0,
  ): string {
    if (typeof value === 'number') {
      return this.formatNumber(value, precision, unit);
    }

    if (typeof value === 'string' || typeof value === 'boolean') {
      return String(value);
    }

    return 'live';
  }

  private formatTrend(delta: number, unit: string | undefined, precision = 0): string {
    if (Math.abs(delta) < 0.001) {
      return 'steady';
    }

    const sign = delta > 0 ? '+' : '';
    return `${sign}${this.formatNumber(delta, precision, unit)}`;
  }

  private formatNumber(value: number, precision: number, unit: string | undefined): string {
    const formatted = value.toFixed(precision);
    return unit ? `${formatted}${unit}` : formatted;
  }

  private toneForDelta(delta: number, fallback: ViamTone | undefined): ViamTone {
    if (fallback) {
      return fallback;
    }

    return delta < 0 ? 'warning' : 'success';
  }
}
