import { Injectable } from '@angular/core';
import { Observable, interval, map, startWith } from 'rxjs';

import { type ITelemetryStreamService } from '../contracts';
import { type Machine, type TelemetrySample } from '../models';

@Injectable()
export class DemoTelemetryStreamService implements ITelemetryStreamService {
  machines(): Observable<readonly Machine[]> {
    return interval(2500).pipe(
      startWith(0),
      map((tick) => this.createMachines(Number(tick))),
    );
  }

  samples(): Observable<readonly TelemetrySample[]> {
    return interval(2500).pipe(
      startWith(0),
      map((tick) => this.createSamples(Number(tick))),
    );
  }

  private createMachines(tick: number): readonly Machine[] {
    return [
      {
        id: 'alpha-07',
        name: 'alpha-07',
        type: 'rover',
        status: 'online',
        healthPercent: 96,
        batteryPercent: 82 - (tick % 6),
        temperatureCelsius: 38 + (tick % 3),
        missionState: 'Active',
        lastSeenAt: new Date().toISOString(),
      },
      {
        id: 'nova-03',
        name: 'nova-03',
        type: 'amr',
        status: 'degraded',
        healthPercent: 78,
        batteryPercent: 64 + (tick % 5),
        temperatureCelsius: 43,
        missionState: 'Hold',
        lastSeenAt: new Date().toISOString(),
      },
      {
        id: 'orion-02',
        name: 'orion-02',
        type: 'manipulator',
        status: 'online',
        healthPercent: 91,
        batteryPercent: 100,
        temperatureCelsius: 32,
        missionState: 'Docked',
        lastSeenAt: new Date().toISOString(),
      },
    ];
  }

  private createSamples(tick: number): readonly TelemetrySample[] {
    const timestamp = new Date().toISOString();

    return [
      {
        id: `sample-health-${tick}`,
        streamId: 'fleet-health',
        machineId: 'alpha-07',
        timestamp,
        value: 94 + (tick % 4),
        unit: '%',
        quality: 'good',
      },
      {
        id: `sample-latency-${tick}`,
        streamId: 'command-latency',
        machineId: 'alpha-07',
        timestamp,
        value: 150 - (tick % 12),
        unit: 'ms',
        quality: 'good',
      },
    ];
  }
}
