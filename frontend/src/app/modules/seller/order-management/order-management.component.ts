import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { Order } from '@model/order';
import { OrderItem } from '@model/order-item';

@Component({
  selector: 'app-order-management',
  standalone: false,
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit {
  orders: OrderItem[] = [];
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
        this.orders = data.map(order => ({
          id: order.id,
          orderId: order.orderId,
          productId: order.productId,
          quantity: order.quantity,
          priceAtPurchase: order.priceAtPurchase,
          product: order.product // include if available in the response
        }));
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
