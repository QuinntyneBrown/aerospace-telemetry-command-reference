import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { ViamFleetTableComponent } from './fleet-table.component';

describe(ViamFleetTableComponent.name, () => {
  it('renders table/list rows from display inputs', async () => {
    await TestBed.configureTestingModule({
      imports: [ViamFleetTableComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ViamFleetTableComponent);
    fixture.componentInstance.title = 'Machine List';
    fixture.componentInstance.rows = [
      {
        name: 'alpha-07',
        detail: 'Rover / RDK online',
        state: 'Active',
        battery: '96%',
        temperature: '38 C',
      },
    ];
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Machine List');
    expect(fixture.nativeElement.textContent).toContain('alpha-07');
    expect(fixture.nativeElement.textContent).toContain('96%');
  });

  it('emits open-fleet intent from the header action', async () => {
    await TestBed.configureTestingModule({
      imports: [ViamFleetTableComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ViamFleetTableComponent);
    const openFleet = vi.fn();
    fixture.componentInstance.openFleet.subscribe(openFleet);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(openFleet).toHaveBeenCalledTimes(1);
  });
});
