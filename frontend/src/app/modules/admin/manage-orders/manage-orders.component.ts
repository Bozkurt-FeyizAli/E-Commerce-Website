import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { Order } from '@model/order';
import { OrderStatus } from '@model/order-status';

@Component({
  selector: 'app-manage-orders',
  standalone: false,
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.adminService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch orders', err);
        this.error = 'Failed to load orders.';
        this.loading = false;
      }
    });
  }

  updateStatus(orderId: number, newStatus: string) {
    this.adminService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        const order = this.orders.find(o => o.id === orderId);
        if (order) order.status = newStatus as OrderStatus;
      },
      error: (err) => {
        console.error('Failed to update order status', err);
      }
    });
  }
}
