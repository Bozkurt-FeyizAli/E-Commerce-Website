import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { PaymentMethod } from '@model/payment-method.enum';
import { Order } from '@model/order';
import { CartService } from 'app/modules/cart/service/cart.service';
import { AuthService } from 'app/core/services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = `${environment.apiUrl}/orders`;
  constructor(private http: HttpClient, private cartService: CartService, private authService: AuthService) {}

  /** Stripe PaymentIntent */
  createPaymentIntent(body: { amount: number; currency: string }) {
    const token = this.authService.getToken(); // JWT token'ı buradan al
    const userId = this.authService.getUserId(); // Kullanıcı ID’sini al

    const payload = {
      ...body,
      userId: userId,
      paymentFormatId: 1 // STRIPE = 1 varsayımı (gerekirse dinamik yap)
    };

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.post(
      `${environment.apiUrl}/payments/intent`,
      payload,
      { headers }
    );
  }




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
    return this.http.post<Order>(`${this.api}/checkout`, dto).pipe(
      // After successful checkout, reload the cart
      tap(() => this.cartService.loadInitialCart())
    );
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
