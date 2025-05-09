import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/services/auth/auth.service';
import { CartService } from 'app/modules/cart/service/cart.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
  userSubscription!: Subscription;

  constructor(
    public authService: AuthService,
    private cartService: CartService, // ✅ Inject cart service
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (!user) return;

      this.username = user.username;

      const roles = this.authService.getUserRoles();
      if (roles.includes('ROLE_ADMIN')) this.role = 'ADMIN';
      else if (roles.includes('ROLE_SELLER')) this.role = 'SELLER';
      else if (roles.includes('ROLE_USER')) this.role = 'USER';
      else this.role = 'UNKNOWN';

      console.log('🔄 Güncel kullanıcı yüklendi → Rol:', this.role);
    });

    // 🛒 Sepet bilgisi
    this.cartService.getCartItems().subscribe(items => {
      this.cartItemCount = items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;
    });
  }


  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }





  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
