import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { Order } from '@model/order';

@Component({
  selector: 'app-order-management',
  standalone: false,
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.isLoading = true;
    this.sellerService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Siparişler yüklenirken hata oluştu.';
        this.isLoading = false;
      }
    });
  }
}
