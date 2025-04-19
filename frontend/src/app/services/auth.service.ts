// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private keycloakTokenUrl = 'http://localhost:8080/realms/JobBoardKeycloack/protocol/openid-connect/token';  // URL pour obtenir le token
    private clientId = 'angular-client';  // ID de ton client Keycloak
    private grantType = 'password';  // Type de grant (ici, "password")
  
    constructor(private http: HttpClient) {}
  
 // Fonction pour envoyer les informations de connexion à Keycloak
 login(username: string, password: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('grant_type', this.grantType);
    body.set('client_id', this.clientId);
    body.set('username', username);
    body.set('password', password);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    // Envoie de la requête pour obtenir un token
    return this.http.post<any>(this.keycloakTokenUrl, body.toString(), { headers });
  }
  // Tu peux stocker le token dans localStorage par exemple

  
  private keycloakUserInfoUrl = 'http://localhost:8080/realms/JobBoardKeycloack/protocol/openid-connect/userinfo';  // URL de l'endpoint UserInfo de Keycloak


  getUserInfo(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get(this.keycloakUserInfoUrl, { headers });
  }
}
