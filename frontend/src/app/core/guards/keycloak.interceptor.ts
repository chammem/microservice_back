// src/app/auth/keycloak.interceptor.ts
import { Injectable } from '@angular/core';
import { KeycloakService } from 'src/app/services/keycloak.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError,from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';  // Import switchMap operator

@Injectable()
export class KeycloakInterceptor implements HttpInterceptor {
  constructor(private keycloak: KeycloakService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip interception for keycloak and assets requests
    if (req.url.includes('keycloak') || req.url.includes('assets')) {
      return next.handle(req);
    }

    // Convert the token promise to observable
    return from(this.keycloak.getToken()).pipe(
      switchMap(token => {
        if (!token) {
          return next.handle(req);
        }

        // Clone request and add auth header
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        

        return next.handle(authReq);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.keycloak.login();
        }
        return throwError(() => error);
      })
    );
  }
}