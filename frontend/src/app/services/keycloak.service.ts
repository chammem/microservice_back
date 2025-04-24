import { Injectable } from '@angular/core';
import _Keycloak from 'keycloak-js';

// Type definition for Keycloak constructor
type KeycloakType = {
  new(config: any): any;
};

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak: any; // Keycloak instance
  private isInitialized = false; // Track initialization state
  private initPromise: Promise<boolean> | null = null;

  constructor() {
    // Create the instance but don't initialize it
    this.createKeycloakInstance();
  }

  private createKeycloakInstance() {
    try {
      const Keycloak = _Keycloak as unknown as KeycloakType;
      this.keycloak = new Keycloak({
        url: 'http://keycloak:8080',
        realm: 'JobBoardKeycloack',
        clientId: 'frontend-client',
        enableLogging: true,
        flow: 'standard'
      });
      console.log('[KEYCLOAK] Instance created');
    } catch (error) {
      console.error('[KEYCLOAK] Failed to create Keycloak instance:', error);
    }
  }
  
  async init(): Promise<boolean> {
    // Return true if already initialized
    if (this.isInitialized) {
      console.log('[KEYCLOAK] Already initialized, skipping');
      return true;
    }
    
    // If initialization is in progress, return the existing promise
    if (this.initPromise) {
      console.log('[KEYCLOAK] Initialization in progress, reusing promise');
      return this.initPromise;
    }
    
    if (!this.keycloak) {
      this.createKeycloakInstance();
    }
    
    // Create a promise that resolves when initialization completes
    this.initPromise = new Promise<boolean>(async (resolve) => {
      try {
        const authenticated = await this.keycloak.init({
          onLoad: 'login-required',
          flow: 'standard',
          pkceMethod: 'S256',
          checkLoginIframe: false
        });
        
        this.isInitialized = true;
        console.log('[KEYCLOAK] Init success, authenticated:', authenticated);
        resolve(authenticated);
      } catch (error) {
        console.error('[KEYCLOAK] Init failed:', error);
        resolve(false);
      } finally {
        // Clear the promise reference after completion
        this.initPromise = null;
      }
    });
    
    return this.initPromise;
  }

  isAuthenticated(): boolean {
    return !!this.keycloak && !!this.keycloak.authenticated;
  }
  
  async login(options?: any): Promise<void> {
    if (!this.keycloak) {
      console.error('[KEYCLOAK] Keycloak instance is undefined');
      this.createKeycloakInstance();
    }
    
    if (!this.keycloak) {
      throw new Error('Failed to initialize Keycloak');
    }
    
    return this.keycloak.login(options);
  }

  async logout(options?: any): Promise<void> {
    if (!this.keycloak) {
      console.error('[KEYCLOAK] Cannot logout - Keycloak instance is undefined');
      return;
    }
    
    return this.keycloak.logout(options);
  }

  getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.keycloak) {
        console.error('[KEYCLOAK] Cannot get token - Keycloak instance is undefined');
        this.createKeycloakInstance();
        reject('Keycloak instance is undefined');
        return;
      }
      
      this.updateToken(90)
        .then(refreshed => {
          if (this.keycloak && this.keycloak.token) {
            resolve(this.keycloak.token);
          } else {
            reject('No token available after refresh');
          }
        })
        .catch(err => {
          console.error('[KEYCLOAK] Error refreshing token:', err);
          reject(err);
        });
    });
  }

  async updateToken(minValidity: number = 30): Promise<boolean> {
    try {
      console.log('[KEYCLOAK] Attempting to refresh token...');
      
      if (!this.keycloak) {
        console.error('[KEYCLOAK] Keycloak instance is undefined, attempting to reinitialize');
        this.createKeycloakInstance();
        
        if (!this.keycloak) {
          console.error('[KEYCLOAK] Failed to reinitialize Keycloak');
          return false;
        }
        
        await this.init();
      }
      
      const refreshed = await this.keycloak.updateToken(minValidity);
      
      if (refreshed) {
        console.log('[KEYCLOAK] Token refreshed successfully');
      } else {
        console.log('[KEYCLOAK] Token not refreshed (still valid)');
      }
      
      return true;
    } catch (err) {
      console.error('[KEYCLOAK] Error refreshing token:', err);
      
      // Handle specific error scenarios
      if (err && (err.error === 'login_required' || err.status === 401)) {
        console.warn('[KEYCLOAK] Session expired, redirecting to login...');
        if (this.keycloak) {
          try {
            await this.keycloak.login();
          } catch (loginErr) {
            console.error('[KEYCLOAK] Failed to redirect to login:', loginErr);
          }
        }
      } else {
        console.warn('[KEYCLOAK] Unrelated error, attempting logout...');
        if (this.keycloak) {
          try {
            await this.keycloak.logout();
          } catch (logoutErr) {
            console.error('[KEYCLOAK] Failed to logout:', logoutErr);
          }
        } else {
          console.error('[KEYCLOAK] Cannot logout - Keycloak instance is undefined');
        }
      }
      
      return false;
    }
  }
}