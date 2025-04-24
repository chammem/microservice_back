import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';
import { CommonModule } from '@angular/common'; // ✅ à importer

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public authService: KeycloakService) {}

  async handleAuthAction(): Promise<void> {
    if (this.authService.isAuthenticated()) {
      await this.authService.logout();
    } else {
      await this.authService.login();
    }
  }

}
