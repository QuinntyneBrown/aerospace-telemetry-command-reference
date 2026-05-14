import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { ViamChartCardComponent } from './chart-card.component';

@Component({
  standalone: true,
  imports: [ViamChartCardComponent],
  template: `
    <viam-chart-card title="Fleet Health" subtitle="Projected chart" [showCanvas]="false">
      <div class="projected-chart">Projected content</div>
    </viam-chart-card>
  `,
})
class ChartCardHostComponent {}

describe(ViamChartCardComponent.name, () => {
  it('renders title and default canvas shell', async () => {
    await TestBed.configureTestingModule({
      imports: [ViamChartCardComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ViamChartCardComponent);
    fixture.componentInstance.title = 'Command Latency';
    fixture.componentInstance.subtitle = 'P95 round trip';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Command Latency');
    expect(fixture.nativeElement.textContent).toContain('P95 round trip');
    expect(fixture.nativeElement.querySelector('canvas')?.getAttribute('aria-label')).toBe(
      'Command Latency chart',
    );
  });

  it('accepts projected chart content', async () => {
    await TestBed.configureTestingModule({
      imports: [ChartCardHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ChartCardHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Projected content');
    expect(fixture.nativeElement.querySelector('canvas')).toBeNull();
  });
});
