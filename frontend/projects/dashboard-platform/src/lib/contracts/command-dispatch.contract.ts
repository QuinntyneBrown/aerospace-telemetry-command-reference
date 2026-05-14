import { InjectionToken } from '@angular/core';
import { type Observable } from 'rxjs';

import { type CommandRequest, type CommandResult } from '../models';

export interface ICommandDispatchService {
  dispatch(request: CommandRequest): Observable<CommandResult>;
}

export const COMMAND_DISPATCH_SERVICE = new InjectionToken<ICommandDispatchService>(
  'COMMAND_DISPATCH_SERVICE',
);
