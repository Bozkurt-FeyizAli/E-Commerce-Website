import { Component } from '@angular/core';
import { User } from '@model/user';
import { AuthService } from 'app/core/services/auth/auth.service';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
user: User | null = null;
  loading = true;
orders: any;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        console.log('Kullanıcı bilgisi:', user);
        this.user = user;
        this.loadOrders();
        this.loading = false;
      },
      error: (err) => {
        console.error('Kullanıcı alınamadı', err);
        this.loading = false;
      }
    });
  }


  loadOrders() {
    this.userService.getMyOrders().subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error('Siparişler alınamadı', err)
    });
  }

  viewOrder(orderId: number) {
    this.router.navigate(['/user/orders', orderId]);
  }
}
