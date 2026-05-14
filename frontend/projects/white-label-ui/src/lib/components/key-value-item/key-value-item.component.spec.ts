import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { ViamKeyValueItemComponent } from './key-value-item.component';

describe(ViamKeyValueItemComponent.name, () => {
  it('renders key-value display text from inputs', async () => {
    await TestBed.configureTestingModule({
      imports: [ViamKeyValueItemComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ViamKeyValueItemComponent);
    fixture.componentInstance.label = 'Policy';
    fixture.componentInstance.value = 'Supervisor gated';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Policy');
    expect(fixture.nativeElement.textContent).toContain('Supervisor gated');
  });
});
