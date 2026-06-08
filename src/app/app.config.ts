import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideExternalRouter } from '@daffodil/external-router';
import { provideMagentoDriver } from '@daffodil/driver/magento';
import { provideDaffProductMagentoDriver } from '@daffodil/product/driver/magento';
import { provideDaffNavigationMagentoDriver } from '@daffodil/navigation/driver/magento';
import { provideDaffExternalRouterMagentoDriver } from '@daffodil/external-router/driver/magento/2.4.3';
import {provideDaffTelemetry, provideDaffTelemetryConfig} from '@daffodil/telemetry';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(),
    provideExternalRouter(),
    provideMagentoDriver({
				uri: "https://mageos-docker.magsite.co.uk/graphql"
			}),
    provideDaffProductMagentoDriver(),
    provideDaffNavigationMagentoDriver(),
    provideDaffExternalRouterMagentoDriver(),
    provideDaffTelemetryConfig({
      enabled: true,
      serviceName: 'daffodil-runtime',
      activityEventName: 'daffodil:activity',
    }),
    provideDaffTelemetry(),
  ]
};
