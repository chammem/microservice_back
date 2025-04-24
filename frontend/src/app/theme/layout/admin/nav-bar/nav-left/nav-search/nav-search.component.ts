// angular import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-search',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './nav-search.component.html',
  styleUrls: ['./nav-search.component.scss']
})
export class NavSearchComponent {
  // public props
  private searchInterval: number | undefined; // Typage explicite
  searchWidth: number = 0;
  searchWidthString: string = '0px'; // Initialisation

  // public method
  searchOn() {
    const searchElement = document.querySelector('#main-search');
    if (!searchElement) return;

    searchElement.classList.add('open');
    
    this.clearExistingInterval();
    
    this.searchInterval = window.setInterval(() => {
      if (this.searchWidth >= 170) {
        this.clearExistingInterval();
        return;
      }
      this.searchWidth += 30;
      this.searchWidthString = `${this.searchWidth}px`;
    }, 35);
  }

  searchOff() {
    const searchElement = document.querySelector('#main-search');
    
    this.clearExistingInterval();
    
    this.searchInterval = window.setInterval(() => {
      if (this.searchWidth <= 0) {
        searchElement?.classList.remove('open');
        this.clearExistingInterval();
        return;
      }
      this.searchWidth -= 30;
      this.searchWidthString = `${this.searchWidth}px`;
    }, 35);
  }

  private clearExistingInterval() {
    if (this.searchInterval) {
      clearInterval(this.searchInterval);
      this.searchInterval = undefined;
    }
  }
}