import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '@model/product';
import { Order } from '@model/order';
import { Payment } from '@model/payment';
import { Transaction } from '@model/transaction';
import { Complaint } from '@model/complaint';
import { ShipmentTracking } from '@model/shipment-tracking';
import { Review } from '@model/review';
import { User } from '@model/user';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private apiUrl = `${environment.apiUrl}/seller`;

  constructor(private http: HttpClient) {}

  // Ürünler
  getMyProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  addProduct(product: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  addProductImage(productId: number, image: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/${productId}/images`, image);
  }

  deleteProductImage(imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/images/${imageId}`);
  }

  // Siparişler
  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  getOrderDetails(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
  }

  updateShipment(orderId: number, trackingData: Partial<ShipmentTracking>): Observable<ShipmentTracking> {
    return this.http.put<ShipmentTracking>(`${this.apiUrl}/orders/${orderId}/tracking`, trackingData);
  }

  // Analytics
  getDashboardData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }

  // Yorumlar
  getProductReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/products/${productId}/reviews`);
  }

  // Ödeme & Transaction
  getMyPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments`);
  }

  getMyTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
  }

  // Şikayetler
  getMyComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/complaints`);
  }

  // Profil
  updateProfile(profileData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, profileData);
  }

  changePassword(data: { oldPassword: string, newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, data);
  }
}
