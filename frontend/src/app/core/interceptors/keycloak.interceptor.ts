import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { from } from 'rxjs'; // Import manquant
import { switchMap } from 'rxjs/operators'; // Import manquant
export const includeBearerTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(KeycloakService);
  
  // Exclure les URLs spécifiées dans bearerExcludedUrls
  if (req.url.includes('/assets/')) {
    return next(req);
  }

  return from(keycloak.getToken()).pipe(
    switchMap(token => {
      if (token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(authReq);
      }
      return next(req);
    })
  );
};