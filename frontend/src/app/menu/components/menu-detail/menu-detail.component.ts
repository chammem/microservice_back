import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem } from '../../../models/menu-item.model';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'app-menu-detail',  // Corrected selector for clarity
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-detail.component.html',  // Corrected the template URL
  styleUrls: ['./menu-detail.component.scss']
})
export class MenuDetailComponent implements OnInit {  // Corrected class name to 'MenuDetailComponent'
  menuItem?: MenuItem;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.menuService.getMenuById(id).subscribe({
      next: (item: MenuItem) => {
        this.menuItem = item;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
