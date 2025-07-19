import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { ApplicationConfig, LOCALE_ID, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { onEvent } from '@fiap-pos-front-end/fiap-tc-shared';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

registerLocaleData(localePt);

function initializeEventListeners() {
  console.log('## CL ## Isso foi chamado?');
  onEvent('user-logged-in', (token: string) => {
    // Here you can add any initialization logic needed when the user logs in
    console.log('User logged in, token received in Angular MFE');
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      console.log('## CL ## CHAMA O APP INITIALIZER EM FORMA DE FUNCAO');
      return new Promise<void>((resolve) => {
        initializeEventListeners();
        // resolve();
      });
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};
