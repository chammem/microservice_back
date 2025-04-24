
import { KeycloakService } from 'src/app/services/keycloak.service';

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const keycloak = inject(KeycloakService);
  const router = inject(Router);

  try {
    // 1. Initialisation
    const initialized = await keycloak.init();
    if (!initialized) {
      router.navigate(['/error']);
      return false;
    }

    // 2. Vérification authentification
    if (keycloak.isAuthenticated()) {
      return true;
    }

    // 3. Redirection vers Keycloak
    await keycloak.login({
      redirectUri: window.location.origin + state.url
    });
    return false;

  } catch (error) {
    console.error('Auth error:', error);
    router.navigate(['/']);
    return false;
  }

  
};