import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './detalle-solicitud.page.routes';

export const detallesolicitudConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
              provideAnimations()]
};
