import { TestBed } from '@angular/core/testing';
import {
  COMMAND_DEFINITIONS,
  DASHBOARD_TILES,
  NAVIGATION_ITEMS,
  TELEMETRY_STREAMS,
  TENANT_CONFIG,
} from 'dashboard-platform';

import { provideHarborLiftDashboard } from './harborlift-dashboard.providers';

describe('provideHarborLiftDashboard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideHarborLiftDashboard()],
    });
  });

  it('registers logistics theme, navigation, tiles, telemetry, and commands', () => {
    expect(TestBed.inject(TENANT_CONFIG).displayName).toBe('HarborLift');
    expect(TestBed.inject(NAVIGATION_ITEMS).map((item) => item.id)).toEqual(
      expect.arrayContaining(['yard', 'docks', 'charging']),
    );
    expect(TestBed.inject(DASHBOARD_TILES).map((tile) => tile.id)).toEqual(
      expect.arrayContaining(['yard-status', 'dock-queue', 'yard-command-center']),
    );
    expect(TestBed.inject(TELEMETRY_STREAMS).map((stream) => stream.id)).toEqual(
      expect.arrayContaining(['dock-utilization', 'charging-queue-depth', 'handoff-status']),
    );
    expect(TestBed.inject(COMMAND_DEFINITIONS).map((command) => command.id)).toEqual(
      expect.arrayContaining(['reroute', 'return-to-charger', 'confirm-handoff']),
    );
  });

  it('does not include TerraGrid configuration content', () => {
    const text = JSON.stringify({
      tenant: TestBed.inject(TENANT_CONFIG),
      tiles: TestBed.inject(DASHBOARD_TILES),
      commands: TestBed.inject(COMMAND_DEFINITIONS),
      streams: TestBed.inject(TELEMETRY_STREAMS),
    });

    expect(text).not.toContain('TerraGrid');
    expect(text).not.toContain('field coverage');
    expect(text).not.toContain('hazard');
  });

  it('maps telemetry-backed tiles to registered logistics streams', () => {
    const streams = new Set(TestBed.inject(TELEMETRY_STREAMS).map((stream) => stream.id));
    const tileStreams = TestBed.inject(DASHBOARD_TILES).flatMap((tile) => [
      ...(tile.requiredTelemetryStreams ?? []),
      ...(((tile.metadata?.['metrics'] as readonly { streamId?: string }[] | undefined) ?? [])
        .map((metric) => metric.streamId)
        .filter((streamId): streamId is string => Boolean(streamId))),
    ]);

    expect(tileStreams).toEqual(
      expect.arrayContaining([
        'dock-utilization',
        'container-throughput',
        'route-blockage',
        'charging-queue-depth',
        'charging-wait-minutes',
      ]),
    );
    expect(tileStreams.filter((streamId) => !streams.has(streamId))).toEqual([]);
  });
});
