import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { ViamStatusChipComponent } from './status-chip.component';

describe(ViamStatusChipComponent.name, () => {
  it('renders label and applies the chip color input', async () => {
    await TestBed.configureTestingModule({
      imports: [ViamStatusChipComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ViamStatusChipComponent);
    fixture.componentInstance.label = 'Active';
    fixture.componentInstance.color = '#4fe3a4';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Active');
    expect(fixture.nativeElement.style.getPropertyValue('--chip-color')).toBe('#4fe3a4');
  });
});
