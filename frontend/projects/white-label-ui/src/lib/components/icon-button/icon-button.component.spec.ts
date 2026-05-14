import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { ViamIconButtonComponent } from './icon-button.component';

describe(ViamIconButtonComponent.name, () => {
  it('renders icon and accessible label from inputs', async () => {
    await TestBed.configureTestingModule({
      imports: [ViamIconButtonComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ViamIconButtonComponent);
    fixture.componentInstance.icon = 'notifications';
    fixture.componentInstance.title = 'Notifications';
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('aria-label')).toBe('Notifications');
    expect(fixture.nativeElement.querySelector('viam-icon')?.textContent.trim()).toBe('notifications');
  });

  it('emits click intent only when enabled', async () => {
    await TestBed.configureTestingModule({
      imports: [ViamIconButtonComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ViamIconButtonComponent);
    const clicked = vi.fn();
    fixture.componentInstance.clicked.subscribe(clicked);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    expect(clicked).toHaveBeenCalledTimes(1);

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    button.click();

    expect(button.disabled).toBe(true);
    expect(clicked).toHaveBeenCalledTimes(1);
  });
});
