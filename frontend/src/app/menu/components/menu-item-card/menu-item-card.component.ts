import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../../services/menu.service'; // Assurez-vous que le chemin est correct
import { MenuItem } from '../../../models/menu-item.model'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-menu-item-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-item-card.component.html',
  styleUrls: ['./menu-item-card.component.css']
})
export class MenuItemCardComponent {
  @Input() menuItem!: MenuItem;
  @Output() deleted = new EventEmitter<void>();

  constructor(private menuService: MenuService) {}

  // Méthode pour supprimer un élément de menu
  deleteItem(): void {
    if (confirm(`Are you sure you want to delete ${this.menuItem.name}?`)) {
      this.menuService.deleteMenuItem(this.menuItem.id).subscribe({
        next: () => {
          // Emit the deleted event to notify the parent component
          this.deleted.emit();
          alert(`${this.menuItem.name} has been successfully deleted.`);
        },
        error: (err: any) => {
          // Gestion d'erreur : afficher un message d'erreur détaillé
          console.error(`Error deleting ${this.menuItem.name}:`, err);
          alert(`Error deleting ${this.menuItem.name}. Please try again later.`);
        }
      });
    }
  }
}
