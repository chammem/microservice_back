declare module 'keycloak-js' {
    interface KeycloakConfig {
      url: string;
      realm: string;
      clientId: string;
    }
  }