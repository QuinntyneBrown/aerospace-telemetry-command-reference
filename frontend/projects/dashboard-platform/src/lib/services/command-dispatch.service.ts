import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { type ICommandDispatchService } from '../contracts';
import { type CommandRequest, type CommandResult } from '../models';

@Injectable()
export class CommandDispatchService implements ICommandDispatchService {
  dispatch(request: CommandRequest): Observable<CommandResult> {
    const result: CommandResult = {
      requestId: request.id,
      commandId: request.commandId,
      targetMachineId: request.targetMachineId,
      status: 'accepted',
      message: 'Command accepted by demo dispatcher.',
      acknowledgedAt: new Date().toISOString(),
    };

    return of(result).pipe(delay(150));
  }
}
