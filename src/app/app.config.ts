import {
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { SpotifyService } from './services/spotify.service';

export function SpotifyAuthInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  if (!req.url.includes('api.spotify.com')) {
    return next(req);
  }
  if (req.headers.has('Token-User')) {
    const cleanHeaders = req.headers.delete('Token-User');
    const cleanReq = req.clone({ headers: cleanHeaders });
    return next(cleanReq);
  }

  return inject(SpotifyService)
    .getToken()
    .pipe(
      switchMap((token) => {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `${token.token_type} ${token.access_token}`,
          },
        });
        return next(authReq);
      })
    );
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([SpotifyAuthInterceptor])),
  ],
};
