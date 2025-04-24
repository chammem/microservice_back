import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../models/menu-item.model';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent {
  @Input() menus: MenuItem[] = [];
  @Input() category: string = 'Tous';

  get filteredMenus(): MenuItem[] {
    // Si la catégorie est 'Tous', on retourne tous les menus
    if (this.category === 'Tous') {
      return this.menus;
    }

    // Comparer les id des catégories pour filtrer les menus
    return this.menus.filter(menu => menu.category.id === Number(this.category));
  }
}
