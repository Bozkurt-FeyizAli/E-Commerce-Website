import {
  Component, OnInit, AfterViewInit, ViewChild, ElementRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'app/core/services/auth/auth.service';
import { CartService } from 'app/modules/cart/service/cart.service';
import { OrderService } from '../service/order.service';
import { CartItem } from '@model/cart-item';
import { Product } from '@model/product';
import { PaymentMethod } from '@model/payment-method.enum';
import { ChangeDetectorRef, NgZone } from '@angular/core';

declare var paypal: any;
declare var Stripe: any;

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  /** –––––– Form & Sepet –––––– */
  checkoutForm!: FormGroup;
  cartRows: { item: CartItem; product: Product }[] = [];
  subtotal = 0;
  shippingFee = 30;
  discount = 0;
  get total() { return this.subtotal + this.shippingFee - this.discount; }
  cartItems: { item: CartItem; product: Product }[] = [];

  /** –––––– UI State –––––– */
  loading = true;
  submitting = false;

  /** –––––– Stripe –––––– */
  private stripe!: any;
  private card!: any;
  private stripeClientSecret = '';
  private stripeMounted = false;

  /** –––––– PayPal –––––– */
  /** –––––– PayPal –––––– */
  @ViewChild('cardEl') cardElementRef?: ElementRef<HTMLDivElement>;
  @ViewChild('paypalEl') paypalEl?: ElementRef<HTMLDivElement>;

  private paypalRendered = false;

  constructor(
    private fb: FormBuilder,
    private cartSvc: CartService,
    private orderSvc: OrderService,
    private router: Router,
    private snack: MatSnackBar,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  /*–––––––––––––––– LIFECYCLE ––––––––––––––––*/
  ngOnInit(): void {
    this.buildForm();
    this.loadCart();
  }

  ngAfterViewInit(): void {
    this.initPaymentUI();       // varsayılan (COD) için hiçbir şey montajlamaz
  }

  /*–––––––––––––––– FORM ––––––––––––––––*/
  private buildForm() {
    this.checkoutForm = this.fb.group({
      fullName      : ['', Validators.required],
      email         : ['', [Validators.required, Validators.email]],
      phoneNumber   : ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      addressLine1  : ['', Validators.required],
      addressLine2  : [''],
      city          : ['', Validators.required],
      state         : ['', Validators.required],
      postalCode    : ['', Validators.required],
      country       : ['', Validators.required],

      payment: this.fb.group({
        method: ['COD' as PaymentMethod, Validators.required]   // ⭐ varsayılan
      })
    });

    this.checkoutForm.get('payment.method')!
      .valueChanges.subscribe(() => this.onPaymentMethodChange());
  }

  get paymentMethod(): PaymentMethod {
    return this.checkoutForm.get('payment.method')!.value;
  }

  /*–––––––––––––––– CART ––––––––––––––––*/
  private loadCart() {
    this.cartSvc.currentCart$.pipe(
      switchMap(items => items.length
        ? forkJoin(items.map(i =>
            this.cartSvc.getProductById(i.productId)
              .pipe(map(p => ({ item: i, product: p }))))
          )
        : of([]))
    ).subscribe(rows => {
      this.cartItems = rows;         // 👈 template görebilir
      this.subtotal = rows.reduce(
        (acc, r) => acc + r.item.quantity * r.product.price, 0);
      this.loading = false;
    });
  }

  /*–––––––––––––––– PAYMENT UI ––––––––––––––––*/
  private initPaymentUI() {
    switch (this.paymentMethod) {
      case 'STRIPE': this.mountStripe(); break;
      case 'PAYPAL': this.mountPayPal(); break;
      default: /* COD → UI gerektirmez */ break;
    }
  }

  private onPaymentMethodChange() {
    this.unmountStripe();
    this.clearPayPal();

    if (this.paymentMethod === 'STRIPE') {
      /*  ⚠️  Önce view’ı güncelle → sonra mountStripe */
      this.cd.detectChanges();                // DOM’u çiz
      // veya Promise.resolve().then(() => this.mountStripe());
      this.zone.runOutsideAngular(() => setTimeout(() => this.mountStripe()));
    }
    if (this.paymentMethod === 'PAYPAL') {
      this.mountPayPal();
    }
  }

  /*–––– Stripe helpers ––––*/
  private mountStripe() {
    if (this.stripeMounted) return;

    this.stripe = Stripe('pk_test_xxxxxxxxxxxxxxxxxxx');
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');
    this.stripeMounted = true;

    // Sunucu‑tarafı PaymentIntent
    this.orderSvc.createPaymentIntent({
      amount: Math.round(this.total * 100),
      currency: 'usd'
    }).subscribe((r: any) => this.stripeClientSecret = r.clientSecret);
  }

  private unmountStripe() {
    if (this.stripeMounted) {
      this.card?.unmount();
      this.stripeMounted = false;
      this.stripeClientSecret = '';
    }
  }

  /*–––– PayPal helpers ––––*/
  private mountPayPal() {
    if (this.paypalRendered) return;

    const render = () => {
      paypal.Buttons({
        createOrder: (_: any, actions: any) =>
          actions.order.create({ purchase_units: [{ amount: { value: this.total.toFixed(2) } }] }),
        onApprove : (_: any, actions: any) =>
          actions.order.capture().then((d: any) => {
            this.placeOrder(d.id);    // PayPal ‑> id gönder
          })
      }).render(this.paypalEl!.nativeElement);
      this.paypalRendered = true;
    };

    if ((window as any).paypal) { render(); }
    else {
      const s = document.createElement('script');
      s.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD';
      s.onload = render;
      document.body.appendChild(s);
    }
  }

  private clearPayPal() {
    if (this.paypalEl?.nativeElement) {
      this.paypalEl.nativeElement.innerHTML = '';
      this.paypalRendered = false;
    }
  }

  /*–––––––––––––––– SUBMIT ––––––––––––––––*/
  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.snack.open('Lütfen zorunlu alanları doldurun', 'Kapat', { duration: 3000 });
      return;
    }

    if (this.paymentMethod === 'STRIPE') {
      return this.confirmStripeCard();
    }
    if (this.paymentMethod === 'PAYPAL') {
      this.snack.open('Lütfen PayPal penceresini kullanın', 'Kapat', { duration: 3000 });
      return;
    }
    // COD
    this.placeOrder();
  }

  private confirmStripeCard() {
    if (!this.stripeClientSecret) {
      this.snack.open('Ödeme başlatılamadı', 'Kapat', { duration: 3000 });
      return;
    }

    this.stripe.confirmCardPayment(this.stripeClientSecret, {
      payment_method: {
        card: this.card,
        billing_details: { name: this.checkoutForm.value.fullName }
      }
    }).then((r: any) => {
      if (r.error) {
        this.snack.open(r.error.message, 'Kapat', { duration: 3000 });
      } else if (r.paymentIntent.status === 'succeeded') {
        this.placeOrder(r.paymentIntent.id);
      }
    });
  }

  private placeOrder(paymentIntentId?: string) {
    this.submitting = true;
    const f = this.checkoutForm.value;

    const userId = this.getUserId(); // Implement this method or use your auth service

    if (userId === null) {
      this.snack.open('Kullanıcı kimliği bulunamadı, lütfen tekrar giriş yapın.', 'Kapat', { duration: 4000 });
      this.submitting = false;
      return;
    }

    this.orderSvc.checkout({
      userId: userId,
      paymentMethod: this.paymentMethod,
      paymentIntentId,
      shippingAddressLine: f.addressLine1,
      shippingCity: f.city,
      shippingState: f.state,
      shippingPostalCode: f.postalCode,
      shippingCountry: f.country
    }).subscribe({
      next : o  => this.goToSuccess(),
      error: () => this.snack.open('Sipariş gönderilemedi', 'Kapat', {duration:4000})
    }).add(() => this.submitting = false);
  }
  getUserId(): number | null {
      return this.authService.getUserId();
  }

  goToSuccess() {
    this.router.navigate(['/checkout/success']);
  }
}
