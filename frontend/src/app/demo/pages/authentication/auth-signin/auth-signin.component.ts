import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideKeycloak } from 'keycloak-angular';
import { KeycloakService } from 'keycloak-angular';
import { inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export default class AuthSigninComponent {
  private keycloak = inject(KeycloakService);

  async login() {
    return this.keycloak.login();
  }

  async logout() {
    return this.keycloak.logout();
  }

  async getToken() {
    return this.keycloak.getToken();
  }

  async isLoggedIn() {
    return this.keycloak.isLoggedIn();
  }
}
