// angular import
import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { NavigationItem } from '../../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent {
  private location = inject(Location);

  // public props
  item = input.required<NavigationItem>(); // Marqué comme required

  // public method
  closeOtherMenu(event: MouseEvent) {
    const ele = event.target as HTMLElement;
    if (!ele) return;

    const parent = ele.parentElement;
    const up_parent = parent?.parentElement?.parentElement;
    const last_parent = up_parent?.parentElement?.parentElement;

    // Gestion des classes avec vérification de nullité
    if (last_parent?.classList.contains('pcoded-submenu')) {
      up_parent?.classList.remove('pcoded-trigger');
      up_parent?.classList.remove('active');
    } else {
      const sections = document.querySelectorAll('.pcoded-hasmenu');
      sections.forEach(section => {
        section.classList.remove('active');
        section.classList.remove('pcoded-trigger');
      });
    }

    parent?.classList.toggle('pcoded-trigger', parent.classList.contains('pcoded-hasmenu'));
    parent?.classList.toggle('active', parent.classList.contains('pcoded-hasmenu'));
    
    up_parent?.classList.toggle('pcoded-trigger', up_parent.classList.contains('pcoded-hasmenu'));
    up_parent?.classList.toggle('active', up_parent.classList.contains('pcoded-hasmenu'));

    last_parent?.classList.toggle('pcoded-trigger', last_parent.classList.contains('pcoded-hasmenu'));
    last_parent?.classList.toggle('active', last_parent.classList.contains('pcoded-hasmenu'));

    // Gestion sécurisée de la navigation mobile
    const navbar = document.querySelector('app-navigation.pcoded-navbar');
    if (navbar?.classList.contains('mob-open')) {
      navbar.classList.remove('mob-open');
    }
  }
}