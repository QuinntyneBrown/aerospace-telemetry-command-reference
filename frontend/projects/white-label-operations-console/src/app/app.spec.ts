import { TestBed } from '@angular/core/testing';
import { DASHBOARD_LAYOUT, provideDashboardPlatform } from 'dashboard-platform';
import { provideWhiteLabelDashboard, WHITE_LABEL_LAYOUT } from 'white-label-dashboard';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        ...provideDashboardPlatform(),
        ...provideWhiteLabelDashboard(),
        {
          provide: DASHBOARD_LAYOUT,
          useValue: {
            ...WHITE_LABEL_LAYOUT,
            tiles: [
              { id: 'test-fleet-overview', tileId: 'fleet-overview', size: 'wide', order: 0 },
            ],
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the neutral operations console', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Viam Reference');
    expect(compiled.textContent).toContain('Online machines');
  });
});
