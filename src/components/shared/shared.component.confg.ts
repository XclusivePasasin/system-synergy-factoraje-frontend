import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './shared.component.routes';

export const sharedConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
              provideAnimations()]
};