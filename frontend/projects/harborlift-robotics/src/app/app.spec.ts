import { TestBed } from '@angular/core/testing';
import { DASHBOARD_LAYOUT, provideDashboardPlatform } from 'dashboard-platform';
import { HARBORLIFT_LAYOUT, provideHarborLiftDashboard } from 'harborlift-dashboard';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        ...provideDashboardPlatform(),
        ...provideHarborLiftDashboard(),
        {
          provide: DASHBOARD_LAYOUT,
          useValue: {
            ...HARBORLIFT_LAYOUT,
            tiles: [{ id: 'test-yard-status', tileId: 'yard-status', size: 'wide', order: 0 }],
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

  it('should render the HarborLift dashboard', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('HarborLift');
    expect(compiled.textContent).toContain('AMRs active');
  });
});
