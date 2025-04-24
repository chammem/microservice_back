import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../../services/menu.service'; // Ensure path is correct
import { MenuItem } from '../../../models/menu-item.model'; // Ensure path is correct

@Component({
  selector: 'app-menu-detail',
  standalone: true,
  imports: [CommonModule],
  providers: [MenuService], // <-- Provide MenuService if not `providedIn: 'root'`
  templateUrl: './menu-detail.component.html',
  styleUrls: ['./menu-detail.component.scss']
})
export class MenuDetailComponent implements OnInit {
  menu: MenuItem | undefined;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.menuService.getMenuById(+id).subscribe({
        next: (menu: MenuItem) => this.menu = menu,
        error: (err: Error) => console.error('Erreur lors du chargement du menu', err)
      });
    }
  }
}