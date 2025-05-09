import { Component, OnInit } from '@angular/core';
import { AdminService, AdminStats } from './service/admin.service';
import { Activity } from '@model/activity';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  adminName = "Admin Name";
  stats!: AdminStats;
  recentActivities: Activity[] = [];
  loading = true;
  today: Date = new Date();

  quickLinks = [
    { title: 'Manage Users', icon: 'people', route: '/admin/users' },
    { title: 'Manage Products', icon: 'shopping_bag', route: '/admin/products' },
    { title: 'Manage Orders', icon: 'receipt', route: '/admin/orders' },
    { title: 'Manage Categories', icon: 'category', route: '/admin/categories' },
    { title: 'Manage Complaints', icon: 'warning', route: '/admin/complaints' }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.adminService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        //this.loadRecentActivities();
      },
      error: (err) => {
        console.error('Failed to load stats:', err);
        this.loading = false;
      }
    });
  }

  // private loadRecentActivities() {
  //   this.adminService.getRecentActivities().subscribe({
  //     next: (activities) => {
  //       this.recentActivities = activities;
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       console.error('Failed to load activities:', err);
  //       this.loading = false;
  //     }
  //   });
  // }

  getActivityIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'USER_REGISTERED': 'person_add',
      'PRODUCT_ADDED': 'add_shopping_cart',
      'ORDER_COMPLETED': 'local_shipping',
      'COMPLAINT_FILED': 'warning',
      'USER_BANNED': 'block',
      'PRODUCT_UPDATED': 'update'
    };
    return iconMap[type] || 'notifications';
  }
}
