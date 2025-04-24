// angular import
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// project import
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ConfigurationComponent } from 'src/app/theme/layout/admin/configuration/configuration.component';
import { BreadcrumbsComponent } from '../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NavBarComponent,
    NavigationComponent,
    RouterModule,
    CommonModule,
    ConfigurationComponent,
    BreadcrumbsComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  // public props
  navCollapsed: boolean = false; // Typage explicite avec initialisation
  navCollapsedMob: boolean = false;
  windowWidth: number = window.innerWidth;

  // public method
  navMobClick() {
    const navbar = document.querySelector('app-navigation.pcoded-navbar');
    
    if (this.navCollapsedMob && !navbar?.classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  closeMenu() {
    const navbar = document.querySelector('app-navigation.pcoded-navbar');
    if (navbar?.classList.contains('mob-open')) {
      navbar.classList.remove('mob-open');
    }
  }
}