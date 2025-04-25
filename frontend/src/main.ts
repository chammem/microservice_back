import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KeycloakService } from './app/services/keycloak.service';
import { APP_INITIALIZER } from '@angular/core';
import { KeycloakInterceptor } from './app/core/guards/keycloak.interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [ 
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      ReactiveFormsModule,
      CommonModule
    ),
    provideAnimations(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakInterceptor,
      multi: true
    },
    FormBuilder,
    MatProgressSpinnerModule
  ],
}).catch((err) => console.error(err));
