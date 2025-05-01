import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { AuthService } from 'app/core/services/auth/auth.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  users: User[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.users = this.authService.getUsers();
  }

  deleteUser(user: User) {
    this.users = this.users.filter(u => u !== user);
  }
}
