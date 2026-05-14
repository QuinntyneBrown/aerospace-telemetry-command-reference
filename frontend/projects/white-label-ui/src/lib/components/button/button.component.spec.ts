import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { ViamButtonComponent } from './button.component';

describe(ViamButtonComponent.name, () => {
  it('renders input label, icon, and variant class', async () => {
    await TestBed.configureTestingModule({
      imports: [ViamButtonComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ViamButtonComponent);
    fixture.componentInstance.label = 'Dispatch';
    fixture.componentInstance.icon = 'send';
    fixture.componentInstance.variant = 'primary';
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.textContent).toContain('Dispatch');
    expect(button.classList.contains('primary')).toBe(true);
    expect(fixture.nativeElement.querySelector('viam-icon')?.textContent.trim()).toBe('send');
  });

  it('emits click intent when enabled', async () => {
    await TestBed.configureTestingModule({
      imports: [ViamButtonComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ViamButtonComponent);
    const clicked = vi.fn();
    fixture.componentInstance.clicked.subscribe(clicked);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(clicked).toHaveBeenCalledTimes(1);
  });

  it('applies disabled state without emitting click intent', async () => {
    await TestBed.configureTestingModule({
      imports: [ViamButtonComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ViamButtonComponent);
    const clicked = vi.fn();
    fixture.componentInstance.disabled = true;
    fixture.componentInstance.clicked.subscribe(clicked);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(button.disabled).toBe(true);
    expect(clicked).not.toHaveBeenCalled();
  });
});
