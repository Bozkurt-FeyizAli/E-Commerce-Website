import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'app/modules/cart/service/cart.service';
import { CheckoutService } from '../service/checkout.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartItem } from '@model/cart-item';
import { Product } from '@model/product';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { ViewChild, ElementRef, AfterViewChecked } from '@angular/core';


declare var paypal: any;
declare var Stripe: any;

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  checkoutForm!: FormGroup;
  cartItems: { item: CartItem; product: Product }[] = [];
  subtotal = 0;
  shippingFee = 30;
  discount = 0;
  total = 0;
  loading = true;
  submitting = false;

  stripe: any;
  card: any;
  paymentInitialized = false;
  stripeClientSecret = '';
  @ViewChild('paypalContainer', { static: false }) paypalContainer!: ElementRef;
paypalRendered = false;


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

  ngAfterViewInit(): void {
    this.initializePaymentOptions();
  }

  private initForm() {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      email: ['', [Validators.required, Validators.email]],
      paymentMethod: ['creditCard', Validators.required]  // Default 'creditCard'
    });

    // Listen for changes
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(() => this.onPaymentMethodChange());
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
      this.subtotal = this.cartItems.reduce(
        (acc, entry) => acc + (entry.item.quantity * entry.product.price),
        0
      );
      this.calculateTotal();
      this.loading = false;
    });
  }

  calculateTotal() {
    this.total = this.subtotal + this.shippingFee - this.discount;
  }

  initializePaymentOptions() {
    const method = this.checkoutForm.value.paymentMethod;
    if (method === 'creditCard') {
      this.initStripe();
      this.startPayment();  // Stripe PaymentIntent başlat
    } else if (method === 'paypal') {
      this.safeInitPayPal();
    }
  }

  onPaymentMethodChange() {
    const method = this.checkoutForm.value.paymentMethod;

    if (method === 'creditCard') {
      this.initStripe();
      this.startPayment();

      // PayPal alanını gizle (isteğe bağlı)
      if (this.paypalContainer?.nativeElement) {
        this.paypalContainer.nativeElement.innerHTML = '';
        this.paypalRendered = false;
      }

    } else if (method === 'paypal') {
      if (!this.paypalRendered) {
        this.safeInitPayPal();
      } else {
        console.log('PayPal zaten render edilmiş.');
      }
    }
  }



  initStripe() {
    if (this.paymentInitialized) return;
    const stripeKey = 'pk_test_51RL4FbPR0NXUo6tZreqe5kbnpPuUID4nrb1gV9VMNnYfyIKNXpTPkQRIxPyIMvKFG8Sc68lrMEnDqvrEtPGIUX0Z004g9feR4W';
    this.stripe = Stripe(stripeKey);
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');

    this.card.on('change', (event: any) => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError!.textContent = event.error.message;
      } else {
        displayError!.textContent = '';
      }
    });

    this.paymentInitialized = true;
  }

  startPayment() {
    const amountInCents = Math.round(this.total * 100);
    this.checkoutService.createPaymentIntent({ amount: amountInCents, currency: 'usd' })
      .subscribe((response: any) => {
        this.stripeClientSecret = response.clientSecret;
        console.log('Stripe clientSecret received:', this.stripeClientSecret);
      }, (err) => {
        console.error('Stripe PaymentIntent creation failed:', err);
        this.snackBar.open('Payment initialization failed. Please try again.', 'Close', { duration: 4000 });
      });
  }

  handleStripePayment() {
    if (!this.stripeClientSecret) {
      this.snackBar.open('Stripe payment could not be started. Please try again.', 'Close', { duration: 3000 });
      return;
    }

    this.stripe.confirmCardPayment(this.stripeClientSecret, {
      payment_method: {
        card: this.card,
        billing_details: {
          name: this.checkoutForm.value.fullName,
          email: this.checkoutForm.value.email
        }
      }
    }).then((result: any) => {
      if (result.error) {
        this.snackBar.open(result.error.message, 'Close', { duration: 3000 });
        this.submitting = false;
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', result.paymentIntent);
        this.placeOrder(result.paymentIntent.id);
      }
    }).catch((error: any) => {
      console.error('Stripe error:', error);
      this.snackBar.open('Payment failed. Please try again.', 'Close', { duration: 3000 });
      this.submitting = false;
    });
  }

  safeInitPayPal() {
    if ((<any>window).paypal) {
      console.log('safeInitPayPal: PayPal zaten tanımlı, render ediliyor.');
      this.renderPayPalButton();
    } else {
      console.log('safeInitPayPal: PayPal tanımlı değil, yükleme başlatılıyor.');
      this.initPayPal();
    }
  }

  initPayPal() {
    if (document.getElementById('paypal-button-container')?.children.length) {
      console.log('PayPal zaten yüklü.');
      return;
    }

    if ((<any>window).paypal) {
      this.renderPayPalButton();
    } else {
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AQty2xvDhcAV2sfqgLiVaurbv3tJe9SQSjaCzyZww2LOnnCKgiewbeiSAufiPzOsCiVp4TGTdSw--r4b&currency=USD';
      script.onload = () => {
        console.log('PayPal script YÜKLENDİ 🚀');
        this.renderPayPalButton();
      };
      script.onerror = (err) => {
        console.error('PayPal SDK yüklenemedi:', err);
      };
      document.body.appendChild(script);
    }
  }


  private renderPayPalButton() {
    if (!(<any>window).paypal) {
      console.error('PayPal henüz tanımlı değil!');
      return;
    }

    if (this.paypalRendered) {
      console.log('PayPal zaten render edilmiş, tekrar render edilmedi.');
      return;
    }

    console.log('PayPal DOM hazır, render başlatılıyor...');
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: this.total.toFixed(2) }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          alert('Transaction completed by ' + details.payer.name.given_name);
        });
      }
    }).render('#paypal-button-container');

    this.paypalRendered = true;  // ✅ Sadece 1 kere render edilmesini sağlıyoruz.
  }


  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.snackBar.open('Please fill all required fields.', 'Close', { duration: 3000 });
      return;
    }

    const paymentMethod = this.checkoutForm.value.paymentMethod;
    if (paymentMethod === 'paypal') {
      this.snackBar.open('Please complete the PayPal payment above.', 'Close', { duration: 3000 });
      return;
    }

    if (paymentMethod === 'creditCard') {
      this.handleStripePayment();
      return;
    }

    // Diğer yöntemler için
    this.placeOrder();
  }

  placeOrder(stripePaymentId?: string) {
    const orderPayload = {
      shippingAddress: {
        fullName: this.checkoutForm.value.fullName,
        addressLine1: this.checkoutForm.value.addressLine1,
        addressLine2: this.checkoutForm.value.addressLine2,
        city: this.checkoutForm.value.city,
        state: this.checkoutForm.value.state,
        postalCode: this.checkoutForm.value.postalCode,
        country: this.checkoutForm.value.country,
        phoneNumber: this.checkoutForm.value.phoneNumber,
        email: this.checkoutForm.value.email
      },
      payment: {
        method: this.checkoutForm.value.paymentMethod,
        stripePaymentId: stripePaymentId || null
      },
      cartItems: this.cartItems.map(entry => ({
        productId: entry.product.id,
        quantity: entry.item.quantity,
        priceWhenAdded: entry.product.price
      })),
      subtotal: this.subtotal,
      shippingFee: this.shippingFee,
      discount: this.discount,
      total: this.total
    };

    this.checkoutService.placeOrder(orderPayload).subscribe({
      next: (res) => {
        this.snackBar.open('Order placed successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/checkout/success'], { state: { orderId: res?.id } });
      },
      error: () => {
        this.snackBar.open('Failed to place order. Please try again.', 'Close', { duration: 4000 });
        this.submitting = false;
      }
    });
  }


}
