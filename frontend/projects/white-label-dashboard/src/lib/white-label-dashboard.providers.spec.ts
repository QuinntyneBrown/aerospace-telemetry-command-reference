import { TestBed } from '@angular/core/testing';
import {
  COMMAND_DEFINITIONS,
  DASHBOARD_TILES,
  NAVIGATION_ITEMS,
  TELEMETRY_STREAMS,
  TENANT_CONFIG,
} from 'dashboard-platform';

import { provideWhiteLabelDashboard } from './white-label-dashboard.providers';

describe('provideWhiteLabelDashboard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideWhiteLabelDashboard()],
    });
  });

  it('registers neutral tenant config, navigation, tiles, telemetry, and commands', () => {
    expect(TestBed.inject(TENANT_CONFIG).displayName).toBe('Viam Reference');
    expect(TestBed.inject(NAVIGATION_ITEMS).map((item) => item.id)).toContain('telemetry');
    expect(TestBed.inject(DASHBOARD_TILES).map((tile) => tile.id)).toEqual(
      expect.arrayContaining(['fleet-overview', 'machine-table', 'command-center']),
    );
    expect(TestBed.inject(TELEMETRY_STREAMS).map((stream) => stream.id)).toContain('fleet-health');
    expect(TestBed.inject(COMMAND_DEFINITIONS).map((command) => command.id)).toEqual(
      expect.arrayContaining([
        'pause',
        'resume',
        'return-to-base',
        'restart-component',
        'lock-out',
      ]),
    );
  });

  it('keeps branded case-study content out of the neutral provider', () => {
    const text = JSON.stringify({
      tenant: TestBed.inject(TENANT_CONFIG),
      tiles: TestBed.inject(DASHBOARD_TILES),
      commands: TestBed.inject(COMMAND_DEFINITIONS),
      streams: TestBed.inject(TELEMETRY_STREAMS),
    });

    expect(text).not.toContain('HarborLift');
    expect(text).not.toContain('TerraGrid');
  });
});
