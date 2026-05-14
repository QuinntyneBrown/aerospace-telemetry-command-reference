import { TestBed } from '@angular/core/testing';
import { DASHBOARD_LAYOUT, provideDashboardPlatform } from 'dashboard-platform';
import { provideTerraGridDashboard, TERRAGRID_LAYOUT } from 'terragrid-dashboard';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        ...provideDashboardPlatform(),
        ...provideTerraGridDashboard(),
        {
          provide: DASHBOARD_LAYOUT,
          useValue: {
            ...TERRAGRID_LAYOUT,
            tiles: [
              { id: 'test-field-coverage', tileId: 'field-coverage', size: 'wide', order: 0 },
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

  it('should render the TerraGrid dashboard', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('TerraGrid');
    expect(compiled.textContent).toContain('Coverage');
  });
});
