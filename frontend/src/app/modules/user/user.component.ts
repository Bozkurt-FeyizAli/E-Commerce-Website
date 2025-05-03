import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/services/auth/auth.service';
import { User } from 'app/shared/models/user';

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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
  }

}
