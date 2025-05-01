import { Component, OnInit } from '@angular/core';
import { AdminService, AdminStats} from '../service/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats!: AdminStats;
  loading = true;
  error = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard stats error', err);
        this.error = 'Failed to load stats';
        this.loading = false;
      }
    });
  }
}
