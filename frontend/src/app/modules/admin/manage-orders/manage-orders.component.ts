import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { Order } from '@model/order';
import { MatTableDataSource } from '@angular/material/table';
import { OrderStatus } from '@model/order-status';

@Component({
  selector: 'app-manage-orders',
  standalone: false,
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'customer', 'amount', 'date', 'status', 'actions'];
  dataSource = new MatTableDataSource<Order>();
  statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  selectedStatus = 'all';
  dateRange: { start: Date | null; end: Date | null } = { start: null, end: null };

  loading = false;
  error = '';
  orders: Order[] = []; // ✅ undefined yerine boş diziyle başlat

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
    this.adminService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;               // ✅ orders dolu olsun
        this.dataSource.data = data;      // ✅ filtreleme için datatable'a da ata
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
          this.dataSource.data = [...this.orders]; // Güncellemeyi yansıt
        }
      },
      error: (err) => console.error('Failed to update status', err)
    });
  }

  deleteOrder(orderId: number) {
    if (!confirm('Are you sure you want to delete this order?')) return;

    this.adminService.deleteOrder(orderId).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.id !== orderId);
        this.dataSource.data = this.orders;
      },
      error: err => console.error('Failed to delete order', err)
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
