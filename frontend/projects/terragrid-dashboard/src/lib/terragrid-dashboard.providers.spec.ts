import { TestBed } from '@angular/core/testing';
import {
  COMMAND_DEFINITIONS,
  DASHBOARD_TILES,
  NAVIGATION_ITEMS,
  TELEMETRY_STREAMS,
  TENANT_CONFIG,
} from 'dashboard-platform';

import { provideTerraGridDashboard } from './terragrid-dashboard.providers';

describe('provideTerraGridDashboard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideTerraGridDashboard()],
    });
  });

  it('registers field robotics theme, navigation, tiles, telemetry, and commands', () => {
    expect(TestBed.inject(TENANT_CONFIG).displayName).toBe('TerraGrid');
    expect(TestBed.inject(NAVIGATION_ITEMS).map((item) => item.id)).toEqual(
      expect.arrayContaining(['field', 'coverage', 'hazards']),
    );
    expect(TestBed.inject(DASHBOARD_TILES).map((tile) => tile.id)).toEqual(
      expect.arrayContaining(['field-coverage', 'hazard-markers', 'field-command-center']),
    );
    expect(TestBed.inject(TELEMETRY_STREAMS).map((stream) => stream.id)).toEqual(
      expect.arrayContaining(['gps-route-progress', 'field-coverage', 'hazard-markers']),
    );
    expect(TestBed.inject(COMMAND_DEFINITIONS).map((command) => command.id)).toEqual(
      expect.arrayContaining(['adjust-route', 'start-inspection-pass', 'mark-hazard']),
    );
  });

  it('does not include HarborLift configuration content', () => {
    const text = JSON.stringify({
      tenant: TestBed.inject(TENANT_CONFIG),
      tiles: TestBed.inject(DASHBOARD_TILES),
      commands: TestBed.inject(COMMAND_DEFINITIONS),
      streams: TestBed.inject(TELEMETRY_STREAMS),
    });

    expect(text).not.toContain('HarborLift');
    expect(text).not.toContain('dock');
    expect(text).not.toContain('AMR');
  });
});
