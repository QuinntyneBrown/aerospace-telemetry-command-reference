import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { ViamCardHeaderComponent } from './card-header.component';

describe(ViamCardHeaderComponent.name, () => {
  it('renders header title, subtitle, and projected actions', async () => {
    await TestBed.configureTestingModule({
      imports: [ViamCardHeaderComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ViamCardHeaderComponent);
    fixture.componentInstance.title = 'Fleet Watch';
    fixture.componentInstance.subtitle = '5 machines online';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Fleet Watch');
    expect(fixture.nativeElement.textContent).toContain('5 machines online');
    expect(fixture.nativeElement.querySelector('.card-actions')).toBeTruthy();
  });
});
