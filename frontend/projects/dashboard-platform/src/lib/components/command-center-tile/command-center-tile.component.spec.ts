import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { COMMAND_DISPATCH_SERVICE, type ICommandDispatchService } from '../../contracts';
import {
  type CommandRequest,
  type CommandResult,
  type DashboardTileDefinition,
} from '../../models';
import { COMMAND_DEFINITIONS } from '../../tokens';
import { CommandCenterTileComponent } from './command-center-tile.component';

interface CommandCenterHarness {
  definition: DashboardTileDefinition;
  commands: readonly { readonly value: string }[];
  onCommandSelected(commandId: string): void;
}

class FakeCommandDispatchService implements ICommandDispatchService {
  readonly result: CommandResult = {
    requestId: 'request',
    commandId: 'pause',
    targetMachineId: 'fleet',
    status: 'accepted',
  };

  readonly dispatch = vi.fn((_: CommandRequest) => of(this.result));
}

describe('CommandCenterTileComponent', () => {
  let dispatch: FakeCommandDispatchService;
  let harness: CommandCenterHarness;

  beforeEach(async () => {
    dispatch = new FakeCommandDispatchService();

    await TestBed.configureTestingModule({
      imports: [CommandCenterTileComponent],
      providers: [
        { provide: COMMAND_DISPATCH_SERVICE, useValue: dispatch },
        {
          provide: COMMAND_DEFINITIONS,
          useValue: [
            { id: 'pause', label: 'Pause', icon: 'pause', risk: 'medium' },
            { id: 'resume', label: 'Resume', icon: 'play_arrow', risk: 'low' },
          ],
        },
      ],
    }).compileComponents();

    harness = TestBed.createComponent(CommandCenterTileComponent)
      .componentInstance as unknown as CommandCenterHarness;
    harness.definition = {
      id: 'command-tile',
      label: 'Command Tile',
      component: CommandCenterTileComponent,
      defaultSize: 'wide',
      commandIds: ['pause'],
    };
  });

  it('filters commands through the tile definition command ids', () => {
    expect(harness.commands.map((command) => command.value)).toEqual(['pause']);
  });

  it('dispatches commands through the command service token', () => {
    harness.onCommandSelected('pause');

    expect(dispatch.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ commandId: 'pause', targetMachineId: 'fleet' }),
    );
  });
});
