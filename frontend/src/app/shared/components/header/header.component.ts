import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'app/core/services/auth/auth.service';
import { CartService } from 'app/modules/cart/service/cart.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Role } from 'app/shared/models/role';
import { User } from 'app/shared/models/user'; 

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  username: string | null = '';
  role: string | null = '';
  cartItemCount: number = 0;
  userSubscription!: Subscription;

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🟠 HeaderComponent ngOnInit çalıştı');

    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      console.log('🟢 Header - user geldi:', user);

      if (!user) {
        const storedUser = localStorage.getItem('user');
        console.log('🟡 Header - localStorage yedeği:', storedUser);

        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          this.authService.saveUser(parsedUser);
          user = parsedUser;
        } else {
          console.warn('🔴 Header - kullanıcı bulunamadı');
          return;
        }
      }

      this.username = user.username;

      const roles: string[] = Array.isArray(user.roles) ? user.roles.map((role: Role) => role.name) : [];
      console.log('🟦 Header - Kullanıcı rolleri:', roles);

      if (roles.includes('ROLE_ADMIN')) this.role = 'ADMIN';
      else if (roles.includes('ROLE_SELLER')) this.role = 'SELLER';
      else if (roles.includes('ROLE_USER')) this.role = 'USER';
      else this.role = 'UNKNOWN';

      console.log('✅ Header - Rol belirlendi:', this.role);
    });

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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
