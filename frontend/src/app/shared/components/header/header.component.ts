import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, SearchIcon, ShoppingCartIcon, HeartIcon, UserIcon, MenuIcon, XIcon } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  categories = ['New Arrivals', 'Women', 'Men', 'Accessories', 'Sale'];
  searchQuery = '';
  isMobileMenuOpen = false;
  cartItemCount = 0;
  wishlistCount = 0;
  isLoggedIn: boolean = false;

  // Inject the Router service to enable navigation.
  constructor(private router: Router) {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  search(): void {
    if (this.searchQuery.trim()) {
      // Navigate to a search results page with the query as a parameter.
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }
}
