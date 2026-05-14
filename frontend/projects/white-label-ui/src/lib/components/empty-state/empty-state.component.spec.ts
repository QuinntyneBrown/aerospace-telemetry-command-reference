import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { ViamEmptyStateComponent } from './empty-state.component';

describe(ViamEmptyStateComponent.name, () => {
  it('renders title, description, icon, and action', async () => {
    await TestBed.configureTestingModule({
      imports: [ViamEmptyStateComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ViamEmptyStateComponent);
    fixture.componentInstance.icon = 'inventory_2';
    fixture.componentInstance.title = 'No machines selected';
    fixture.componentInstance.description = 'Choose a machine to inspect its telemetry.';
    fixture.componentInstance.action = {
      label: 'Choose machine',
      value: 'choose',
      icon: 'search',
    };
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No machines selected');
    expect(fixture.nativeElement.textContent).toContain('Choose a machine to inspect its telemetry.');
    expect(fixture.nativeElement.querySelector('.empty-icon viam-icon')?.textContent.trim()).toBe(
      'inventory_2',
    );
    expect(fixture.nativeElement.querySelector('viam-button')?.textContent).toContain('Choose machine');
  });

  it('emits the configured action value', async () => {
    await TestBed.configureTestingModule({
      imports: [ViamEmptyStateComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ViamEmptyStateComponent);
    const selected = vi.fn();
    fixture.componentInstance.action = {
      label: 'Add tile',
      value: 'add-tile',
    };
    fixture.componentInstance.actionSelected.subscribe(selected);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(selected).toHaveBeenCalledWith('add-tile');
  });

  it('passes disabled state to the action button', async () => {
    await TestBed.configureTestingModule({
      imports: [ViamEmptyStateComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ViamEmptyStateComponent);
    fixture.componentInstance.action = {
      label: 'Unavailable',
      value: 'unavailable',
      disabled: true,
    };
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });
});
