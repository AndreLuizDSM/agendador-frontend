import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { routes } from './app.routes';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';

// Registra os dados do locale pt-BR para que Angular Material (datepicker/timepicker)
// e os pipes de data formatem em português e no padrão 24h.
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // Define pt-BR como locale padrão do app; o DateAdapter do Material usa esse
    // valor, então o mat-timepicker passa a exibir 24h em vez de AM/PM.
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },

    // withInterceptors registra os interceptors funcionais na cadeia HTTP.
    // Todo request feito com HttpClient vai passar pelo httpErrorInterceptor.
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
  ]
};
