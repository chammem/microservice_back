// angular import
import { Component, inject, output } from '@angular/core';
import { Location } from '@angular/common';

// project import
import { environment } from 'src/environments/environment';
import { NavigationItem, NavigationItems } from '../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavGroupComponent } from './nav-group/nav-group.component';

@Component({
  selector: 'app-nav-content',
  standalone: true,
  imports: [SharedModule, NavGroupComponent],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent {
  private location = inject(Location);

  // version
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment;

  navigations: NavigationItem[] = NavigationItems;
  wrapperWidth: number = 0; // Initialisé avec une valeur par défaut
  windowWidth: number = window.innerWidth;

  NavCollapsedMob = output();

  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.getBaseHref(); // Méthode sécurisée pour obtenir le baseHref
    
    if (baseHref) {
      current_url = baseHref + current_url;
    }

    const link = `a.nav-link[ href='${current_url}' ]`;
    const ele = document.querySelector(link);
    
    if (ele) {
      this.activateMenuItems(ele);
    }
  }

  private getBaseHref(): string {
    // Solution plus propre que d'accéder à la propriété privée
    return document.baseURI.replace(window.location.origin, '');
  }

  private activateMenuItems(element: Element): void {
    const parent = element.parentElement;
    if (!parent) return;

    const up_parent = parent.parentElement?.parentElement;
    const last_parent = up_parent?.parentElement;

    // Fonction helper pour activer les éléments
    const activateElement = (el: HTMLElement | null | undefined) => {
      if (el?.classList.contains('pcoded-hasmenu')) {
        el.classList.add('pcoded-trigger');
        el.classList.add('active');
      }
    };

    activateElement(parent);
    activateElement(up_parent);
    activateElement(last_parent);
  }
}