import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// Importation de la nouvelle fonction provideKeycloak
import { provideKeycloak } from 'keycloak-angular';
import { includeBearerTokenInterceptor } from './app/core/interceptors/keycloak.interceptor';

if (environment.production) {
  enableProdMode();
}



bootstrapApplication(AppComponent, {
  providers: [
    // Configuration Keycloak (seul changement nécessaire)
    provideKeycloak({
      config: {
        url: 'http://localhost:8080',
        realm: 'JobBoardKeycloack',
        clientId: 'angular-client'
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod: 'S256'
      }
    }),
    provideHttpClient(
      withInterceptors([includeBearerTokenInterceptor])
        ), // Initialisation de Keycloak avec la configuration correcte
    provideAnimations(),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
  ]
}).catch((err) => console.error(err));
