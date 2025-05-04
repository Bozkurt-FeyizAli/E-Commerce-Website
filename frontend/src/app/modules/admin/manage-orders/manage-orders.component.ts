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
updateStatus(arg0: any,arg1: any) {
throw new Error('Method not implemented.');
}
  displayedColumns: string[] = ['id', 'customer', 'amount', 'date', 'status', 'actions'];
  dataSource = new MatTableDataSource<Order>();
  statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  selectedStatus = 'all';
  dateRange: { start: Date | null; end: Date | null } = { start: null, end: null };
loading: any;
error: any;
orders: any;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.adminService.getAllOrders().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => console.error('Failed to fetch orders', err)
    });
  }

  updateOrderStatus(orderId: number, newStatus: string) {
    this.adminService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        const order = this.dataSource.data.find(o => o.id === orderId);
        if (order) order.status = newStatus as OrderStatus;
      },
      error: (err) => console.error('Failed to update status', err)
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
