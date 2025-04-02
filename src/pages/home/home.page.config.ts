import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './home.page.routes';

export const homeConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
              provideAnimations()]
};
