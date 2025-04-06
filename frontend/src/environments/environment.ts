

export const environment = {
  production: true,
  apiUrl: 'http://localhost:8086',
  secure: false,
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'JobBoardKeycloack',
    clientId: 'angular-client'
  }
};