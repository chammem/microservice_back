// angular import
import { Component, input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// project import
import { NavigationItem } from '../../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavItemComponent } from '../nav-item/nav-item.component';

@Component({
  selector: 'app-nav-collapse',
  standalone: true,
  imports: [SharedModule, NavItemComponent, RouterModule, CommonModule],
  templateUrl: './nav-collapse.component.html',
  styleUrls: ['./nav-collapse.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', display: 'block' }),
        animate('250ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [animate('250ms ease-in', style({ transform: 'translateY(-100%)' }))])
    ])
  ]
})
export class NavCollapseComponent {
  // public props
  item = input.required<NavigationItem>();
  visible = false;

  // public method
  navCollapse(e: MouseEvent) {
    this.visible = !this.visible;
    let parent = e.target as HTMLElement;

    // Gestion sécurisée de la hiérarchie parentale
    if (parent?.tagName === 'SPAN') {
      parent = parent.parentElement ?? parent;
    }

    const parentElement = parent.parentElement;
    if (!parentElement) return;

    // Fermer les autres menus ouverts
    const sections = document.querySelectorAll('.pcoded-hasmenu');
    sections.forEach(section => {
      if (section !== parentElement) {
        section.classList.remove('pcoded-trigger');
      }
    });

    // Navigation sécurisée dans la hiérarchie
    let currentParent: HTMLElement | null = parentElement.parentElement;
    let preParent: HTMLElement | null = currentParent?.parentElement?.parentElement ?? null;

    // Activer les parents avec pcoded-hasmenu
    while (currentParent?.classList.contains('pcoded-hasmenu')) {
      currentParent.classList.add('pcoded-trigger');
      currentParent = currentParent.parentElement?.parentElement ?? null;
    }

    // Activer les parents avec pcoded-submenu
    while (preParent?.classList.contains('pcoded-submenu')) {
      const parentToActivate = preParent.parentElement;
      if (parentToActivate) {
        parentToActivate.classList.add('pcoded-trigger');
      }
      preParent = preParent.parentElement?.parentElement?.parentElement ?? null;
    }

    // Basculer l'état du menu actuel
    parentElement.classList.toggle('pcoded-trigger');
  }
}