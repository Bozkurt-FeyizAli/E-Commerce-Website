import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { User } from '@model/user';

@Component({
  selector: 'app-manage-users',
  standalone: false,
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  users: User[] = [];
  loading = true;
  error = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
        this.error = 'Failed to load users.';
        this.loading = false;
      }
    });
  }

  toggleBan(user: User) {
    const newStatus = !user.isBanned;
    this.adminService.banUser(user.id, newStatus).subscribe({
      next: () => {
        user.isBanned = newStatus;
      },
      error: (err) => {
        console.error('Failed to update ban status', err);
      }
    });
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== userId);
        },
        error: (err) => {
          console.error('Failed to delete user', err);
        }
      });
    }
  }

  getUserRoles(user: User): string {
    return user.roles
    }
}
