import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) { }

  /**
   * Stripe için PaymentIntent oluşturur
   * @param data amount ve currency bilgisi gönderilir
   */
  createPaymentIntent(data: { amount: number, currency: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-payment-intent`, data);
  }

  /**
   * Sipariş oluşturur (Stripe veya PayPal fark etmez)
   * @param orderData sipariş payload'u
   */
  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/place`, orderData);
  }
}
