import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { ViamMetricCardComponent } from './metric-card.component';

describe(ViamMetricCardComponent.name, () => {
  it('renders metric label, value, trend, and icon from inputs', async () => {
    await TestBed.configureTestingModule({
      imports: [ViamMetricCardComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ViamMetricCardComponent);
    fixture.componentInstance.label = 'Online Machines';
    fixture.componentInstance.value = '124';
    fixture.componentInstance.trend = '+8 since 06:00';
    fixture.componentInstance.icon = 'precision_manufacturing';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Online Machines');
    expect(fixture.nativeElement.textContent).toContain('124');
    expect(fixture.nativeElement.textContent).toContain('+8 since 06:00');
    expect(fixture.nativeElement.textContent).toContain('precision_manufacturing');
  });
});
