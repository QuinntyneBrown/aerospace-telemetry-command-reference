import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideDashboardPlatform } from 'dashboard-platform';
import { provideWhiteLabelDashboard } from 'white-label-dashboard';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    ...provideDashboardPlatform(),
    ...provideWhiteLabelDashboard(),
  ],
};
