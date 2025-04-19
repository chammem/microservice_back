import { Injectable } from '@angular/core';
import _Keycloak from 'keycloak-js';

// Déclaration de type pour contourner le problème
interface KeycloakType {
  new (config?: any): any;
  (config?: any): any;
}

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak: any; // Temporairement any pour compatibilité

  constructor() {
    // Initialisation garantie
    const Keycloak = _Keycloak as unknown as KeycloakType;
    this.keycloak = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'JobBoardKeycloack',
      clientId: 'angular-client',
      enableLogging: true,
       flow: 'standard'
    });
  }

  
  async init(): Promise<boolean> {
    return this.keycloak.init({
      onLoad: 'login-required',
      flow: 'standard',
      pkceMethod: 'S256'
    });
  }

  // Méthodes typées manuellement
  isAuthenticated(): boolean {
    return !!this.keycloak.authenticated;
  }
  
  async login(options?: any): Promise<void> {
    return this.keycloak.login(options);
  }


  getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.updateToken(90).then(refreshed => {
        if (refreshed) {
          resolve(this.keycloak.token);
        } else {
          reject('Failed to refresh token');
        }
      }).catch(err => reject(err));
    });
  }

  async updateToken(minValidity: number = 30): Promise<boolean> {
    try {
      console.log('[KEYCLOAK] Tentative de rafraîchissement du token...');
      
      const refreshed = await this.keycloak.updateToken(minValidity);
  
      if (refreshed) {
        console.log('[KEYCLOAK] Token rafraîchi avec succès.');
        return true;
      } else {
        console.warn('[KEYCLOAK] Token NON rafraîchi (mais encore valide ?).');
        return true; // parfois Keycloak retourne false si déjà valide
      }
  
    } catch (err) {
      console.error('[KEYCLOAK] Erreur pendant le rafraîchissement du token :', err);
  
      if (err && err.error === 'login_required') {
        console.warn('[KEYCLOAK] Session expirée. Redirection vers login...');
        await this.keycloak.login(); // reconnecte automatiquement
      } else {
        console.warn('[KEYCLOAK] Erreur non liée à login, tentative de logout...');
        await this.keycloak.logout();
      }
  
      return false;
    }
  }
  
  async logout(): Promise<void> {
    await this.keycloak.logout({
      redirectUri: 'http://localhost:4200' // URL de redirection après logout
    });
  }


}