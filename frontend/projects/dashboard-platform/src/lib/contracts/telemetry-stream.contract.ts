import { InjectionToken } from '@angular/core';
import { type Observable } from 'rxjs';

import { type Machine, type TelemetrySample } from '../models';

export interface ITelemetryStreamService {
  machines(): Observable<readonly Machine[]>;
  samples(): Observable<readonly TelemetrySample[]>;
}

export const TELEMETRY_STREAM_SERVICE = new InjectionToken<ITelemetryStreamService>(
  'TELEMETRY_STREAM_SERVICE',
);
