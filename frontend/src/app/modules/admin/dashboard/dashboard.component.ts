// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminService, AdminStats } from '../service/admin.service';
import { Activity } from '@model/activity';
// import { ChartType, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats!: AdminStats;
  recentActivities: Activity[] = [];
  loading = true;
  error = '';
  adminName = "Admin Name";

  // Chart data
  chartData: any = {
    labels: [],
    datasets: [{
      label: 'Sales',
      data: [],
      borderColor: '#3F51B5',
      fill: false
    }]
  };

  quickLinks = [
    { title: 'Manage Users', icon: 'people', route: '/admin/users' },
    { title: 'Manage Products', icon: 'shopping_bag', route: '/admin/products' },
    { title: 'Manage Orders', icon: 'receipt', route: '/admin/orders' },
    { title: 'Manage Categories', icon: 'category', route: '/admin/categories' },
    { title: 'Manage Complaints', icon: 'warning', route: '/admin/complaints' }
  ];
chartOptions: any;

// chartType: ChartType = 'line';
//   chartOptions: ChartConfiguration['options'] = {
//     responsive: true,
//     maintainAspectRatio: false
//   };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.adminService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loadRecentActivities();
        this.prepareChartData(stats);
      },
      error: (err) => {
        console.error('Dashboard error:', err);
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      }
    });
  }

  private loadRecentActivities() {
    this.adminService.getRecentActivities().subscribe({
      next: (activities) => {
        this.recentActivities = activities;
        this.loading = false;
      },
      error: (err) => {
        console.error('Activities error:', err);
        this.loading = false;
      }
    });
  }

  private prepareChartData(stats: AdminStats) {
    if (stats.salesStats) {
      this.chartData = {
        labels: stats.salesStats.map((s: { date: any; }) => s.date),
        datasets: [{
          label: 'Daily Sales',
          data: stats.salesStats.map((s: { totalRevenue: any; }) => s.totalRevenue),
          borderColor: '#3F51B5',
          backgroundColor: 'rgba(63, 81, 181, 0.1)',
          fill: true,
          tension: 0.4
        }]
      };
    }
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'USER_REGISTERED': 'person_add',
      'ORDER_COMPLETED': 'local_shipping',
      'PRODUCT_ADDED': 'add_shopping_cart',
      'COMPLAINT_FILED': 'warning',
      'USER_BANNED': 'block'
    };
    return icons[type] || 'notifications';
  }
}
