import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service'; // Service to handle API calls
import { Order } from '@models/order.model';
import { Product } from '@models/product.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  recentOrders: Order[] = [];
  lowStockProducts: Product[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    // Fetch recent orders and low stock products from the server
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.adminService.getRecentOrders().subscribe((orders) => {
      this.recentOrders = orders;
    });

    this.adminService.getLowStockProducts().subscribe((products) => {
      this.lowStockProducts = products;
    });
  }
}
