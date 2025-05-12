import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { User } from '@model/user';
import { MatTableDataSource } from '@angular/material/table';
import { Role } from '@model/role';

@Component({
  selector: 'app-manage-users',
  standalone: false,
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'roles', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>();
  loading = true;
  error = '';
  searchQuery = '';
  selectedRole = 'all';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
        this.error = 'Failed to load users.';
        this.loading = false;
      }
    });
  }

  applyFilter() {
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const matchesSearch =
        data.username.toLowerCase().includes(filter) ||
        data.email.toLowerCase().includes(filter);
      const matchesRole =
        this.selectedRole === 'all' ||
        (Array.isArray(data.roles) && data.roles.map(r => String(r).toLowerCase()).includes(this.selectedRole.toLowerCase()));
      return matchesSearch && matchesRole;
    };
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
  }

  toggleBan(user: User) {
    const action$ = user.isBanned ?
      this.adminService.unbanUser(user.id) :
      this.adminService.banUser(user.id, true);

    action$.subscribe({
      next: () => {
        user.isBanned = !user.isBanned;
        this.dataSource.data = [...this.dataSource.data];
      },
      error: (err) => console.error('Failed to update ban status', err)
    });
  }

  deavtivateUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deactivateUser(userId).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(u => u.id !== userId);
        },
        error: (err) => console.error('Failed to delete user', err)
      });
    }
  }

  getUserRoles(user: User): Role[] {
    return user.roles;
  }

  editUser(user: User) {
    // Implement edit user logic
    console.log('Edit user:', user);
  }
}
