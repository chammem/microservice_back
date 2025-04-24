import { enableProdMode, importProvidersFrom, Component } from '@angular/core';
import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KeycloakService } from './app/services/keycloak.service';
import { APP_INITIALIZER } from '@angular/core';
import { KeycloakInterceptor } from './app/core/guards/keycloak.interceptor';
import { MenuService } from './app/services/menu.service'; // Import MenuService
import { RouterOutlet } from '@angular/router'; 
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module'; // Import routes depuis app-routing.module

if (environment.production) {
  enableProdMode();
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="branding">
          <h1>Restaurant Menu Manager</h1>
        </div>
      </header>
      
      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="app-footer">
        <p>&copy; 2025 Restaurant Menu Manager</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .app-header {
      background-color: #1976D2;
      color: white;
      padding: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .branding h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }
    
    .app-content {
      flex: 1;
      padding: 20px 0;
    }
    
    .app-footer {
      background-color: #333;
      color: white;
      text-align: center;
      padding: 16px;
      margin-top: auto;
    }
    
    .app-footer p {
      margin: 0;
      font-size: 14px;
    }
  `]
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      HttpClientModule,
      ReactiveFormsModule,
      CommonModule
    ),
    provideAnimations(),
    provideRouter(routes), // Ajout des routes ici
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakInterceptor,
      multi: true
    },
    MenuService // Ajouter MenuService ici
  ],
}).catch((err) => console.error(err));
