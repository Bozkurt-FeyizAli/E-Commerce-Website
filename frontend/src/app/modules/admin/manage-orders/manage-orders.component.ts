import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { Order } from '@model/order';
import { MatTableDataSource } from '@angular/material/table';
import { OrderStatus } from '@model/order-status';

@Component({
  selector: 'app-manage-orders',
  standalone: false,
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.css'
})
export class ManageOrdersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'customer', 'amount', 'date', 'status', 'actions'];
  dataSource = new MatTableDataSource<Order>();
  statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  selectedStatus = 'all';
  dateRange: { start: Date | null; end: Date | null } = { start: null, end: null };

  loading = false;
  error = '';
  orders: Order[] = [];
  orderToDelete: Order | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
    this.error = '';

    this.adminService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch orders';
        console.error(this.error, err);
        this.loading = false;
      }
    });
  }

  updateOrderStatus(orderId: number, newStatus: string) {
    this.adminService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
          order.status = newStatus as OrderStatus;
          this.dataSource.data = [...this.orders];
        }
      },
      error: (err) => {
        console.error('Failed to update status', err);
        this.error = 'Failed to update order status';
      }
    });
  }

  confirmDeleteOrder(order: Order) {
    this.orderToDelete = order;
  }

  cancelDelete() {
    this.orderToDelete = null;
  }

  proceedWithDelete() {
    if (!this.orderToDelete) return;

    const orderId = this.orderToDelete.id;
    this.adminService.deleteOrder(orderId).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.id !== orderId);
        this.dataSource.data = this.orders;
        this.orderToDelete = null;
      },
      error: (err) => {
        console.error('Failed to delete order', err);
        this.error = 'Failed to delete order';
        this.orderToDelete = null;
      }
    });
  }

  applyFilters() {
    this.dataSource.filterPredicate = (data: Order, filter: string) => {
      const statusMatch = this.selectedStatus === 'all' ||
        data.status.toLowerCase() === this.selectedStatus.toLowerCase();
      const dateMatch = !this.dateRange.start || !this.dateRange.end ||
        (new Date(data.orderDate) >= this.dateRange.start &&
         new Date(data.orderDate) <= this.dateRange.end);
      return statusMatch && dateMatch;
    };
    this.dataSource.filter = 'trigger';
  }
}
