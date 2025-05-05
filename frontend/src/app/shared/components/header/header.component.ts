import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/services/auth/auth.service';
import { CartService } from 'app/modules/cart/service/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string | null = '';
  role: string | null = '';
  cartItemCount: number = 0; // ✅ Add this

  constructor(
    public authService: AuthService,
    private cartService: CartService, // ✅ Inject cart service
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const token = this.authService.getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.username = payload.sub || payload.username;
          this.role = payload.role || null;
        } catch (e) {
          console.error('Failed to parse token', e);
        }
      }
    }

    // Always listen to cart items (even if not logged in)
    this.cartService.getCartItems().subscribe(items => {
      if (!items) {
        this.cartItemCount = 0;
        return;
      }
      this.cartItemCount = items.reduce((total, item) => total + (item.quantity || 0), 0);
    });

  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
