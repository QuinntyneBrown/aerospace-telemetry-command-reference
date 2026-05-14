import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideDashboardPlatform } from 'dashboard-platform';
import { provideRouter } from '@angular/router';
import { provideTerraGridDashboard } from 'terragrid-dashboard';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    ...provideDashboardPlatform(),
    ...provideTerraGridDashboard(),
  ],
};
