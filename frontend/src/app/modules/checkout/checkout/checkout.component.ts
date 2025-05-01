import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'app/modules/cart/service/cart.service';
import { CheckoutService } from '../service/checkout.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartItem } from '@model/cart-item';
import { Product } from '@model/product';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: { item: CartItem; product: Product }[] = [];
  totalPrice: number = 0;
  loading = true;
  submitting = false;

  paymentMethods = [
    { id: 1, name: 'Credit Card' },
    { id: 2, name: 'PayPal' },
    { id: 3, name: 'Cash on Delivery' }
  ];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCartDetails();
  }

  private initForm() {
    this.checkoutForm = this.fb.group({
      shippingAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      paymentMethod: ['', Validators.required]
    });
  }

  private loadCartDetails() {
    this.cartService.currentCart$.pipe(
      switchMap(items => {
        if (items.length === 0) {
          this.loading = false;
          return of([]);
        }
        return forkJoin(
          items.map(item =>
            this.cartService.getProductById(item.productId).pipe(
              map(product => ({ item, product }))
            )
          )
        );
      })
    ).subscribe(details => {
      this.cartItems = details;
      this.totalPrice = this.cartItems.reduce(
        (acc, entry) => acc + (entry.item.quantity * entry.product.price),
        0
      );
      this.loading = false;
    });
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.snackBar.open('Please fill all required fields.', 'Close', { duration: 3000 });
      return;
    }

    this.submitting = true;

    const orderPayload = {
      shippingAddress: `${this.checkoutForm.value.shippingAddress}, ${this.checkoutForm.value.city}, ${this.checkoutForm.value.state}, ${this.checkoutForm.value.postalCode}, ${this.checkoutForm.value.country}`,
      phoneNumber: this.checkoutForm.value.phoneNumber,
      paymentFormatId: this.checkoutForm.value.paymentMethod,
      cartItems: this.cartItems.map(entry => ({
        productId: entry.product.id,
        quantity: entry.item.quantity,
        priceWhenAdded: entry.product.price
      }))
    };

    this.checkoutService.placeOrder(orderPayload).subscribe({
      next: () => {
        this.snackBar.open('Order placed successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/checkout/success']);
      },
      error: () => {
        this.snackBar.open('Failed to place order. Please try again.', 'Close', { duration: 4000 });
        this.submitting = false;
      }
    });
  }
}
