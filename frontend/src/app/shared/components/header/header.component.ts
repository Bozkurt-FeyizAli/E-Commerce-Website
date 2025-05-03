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
    // Get user info if logged in
    if (this.authService.isLoggedIn()) {
      const token = this.authService.getToken();
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.username = payload.sub || payload.username;
        this.role = payload.role || null;
      }

      // Subscribe to cart item count
    this.cartService.getCartItems().subscribe(items => {
      this.cartItemCount = items.length; // or sum quantities if needed
    });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
