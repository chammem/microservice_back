// angular import
import { Component, OnInit, inject, input } from '@angular/core';
import { Location } from '@angular/common';

// project import
import { NavigationItem } from '../../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { NavCollapseComponent } from '../nav-collapse/nav-collapse.component';

@Component({
  selector: 'app-nav-group',
  standalone: true,
  imports: [SharedModule, NavItemComponent, NavCollapseComponent],
  templateUrl: './nav-group.component.html',
  styleUrls: ['./nav-group.component.scss']
})
export class NavGroupComponent implements OnInit {
  private location = inject(Location);

  // public props
  readonly item = input.required<NavigationItem>();

  // life cycle event
  ngOnInit() {
    let current_url = this.location.path();
    const baseHref = this.getBaseHref();
    
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
    return document.baseURI.replace(window.location.origin, '');
  }

  private activateMenuItems(element: Element): void {
    const parent = element.parentElement;
    if (!parent) return;

    const up_parent = parent.parentElement?.parentElement ?? null;
    const pre_parent = up_parent?.parentElement ?? null;
    const last_parent = up_parent?.parentElement?.parentElement?.parentElement ?? null;

    // Fonction helper avec type plus permissif
    const activateElement = (el: HTMLElement | null | undefined) => {
      if (el?.classList.contains('pcoded-hasmenu')) {
        el.classList.add('pcoded-trigger');
        el.classList.add('active');
      }
    };

    activateElement(parent);
    activateElement(up_parent);
    activateElement(pre_parent);

    if (last_parent?.classList.contains('pcoded-hasmenu')) {
      last_parent.classList.add('pcoded-trigger');
      activateElement(pre_parent);
      last_parent.classList.add('active');
    }
  }
}