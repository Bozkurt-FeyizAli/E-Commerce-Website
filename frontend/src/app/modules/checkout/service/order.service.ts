import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { PaymentMethod } from '@model/payment-method.enum';
import { Order } from '@model/order';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  /** Stripe PaymentIntent */
  createPaymentIntent(body: { amount: number; currency: string }) {
    return this.http.post(`${environment.apiUrl}/payments/create-payment-intent`, body);
  }

  /** COD / Stripe / PayPal siparişi */
  checkout(dto: {
    userId: number;
    paymentMethod: PaymentMethod;
    paymentIntentId?: string;
    shippingAddressLine: string;
    shippingCity: string;
    shippingState: string;
    shippingPostalCode: string;
    shippingCountry: string;
  }): Observable<Order> {
    return this.http.post<Order>(`${this.api}/checkout`, dto);
  }

  placeOrder(order: any) {
    return this.http.post<{ id: number }>(`${this.api}/checkout`, order).subscribe((response) => {
      if (response && response.id) {
        this.redirectToSuccess(response.id);
      }
    });
  }

  /** Checkout success redirect */
  redirectToSuccess(orderId: number) {
    window.location.href = `/success/${orderId}`;
  }
}
