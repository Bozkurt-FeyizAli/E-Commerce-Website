import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/services/auth/auth.service';
import { User } from 'app/shared/models/user';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})


export class UserComponent implements OnInit {
  user: User | null = null;
  loading = true;
orders: any;

  constructor(private authService: AuthService, private userService: UserService) {}

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.user = user;
        this.loadOrders();  // Siparişleri getir
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadOrders() {
    this.userService.getMyOrders().subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error('Siparişler alınamadı', err)
    });
  }

}
