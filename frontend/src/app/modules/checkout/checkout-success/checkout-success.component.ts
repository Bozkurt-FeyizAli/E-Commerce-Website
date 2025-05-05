import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  standalone: false,
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.css']
})
export class CheckoutSuccessComponent implements OnInit {

  orderId: string | null = null;

  constructor(
    private route: Router
  ) {}

  ngOnInit(): void {
    // Angular'da navigate ederken state kullanmıştık: { state: { orderId: ... } }
    const nav = this.route.getCurrentNavigation();
    this.orderId = nav?.extras?.state?.['orderId'] || null;

    if (!this.orderId) {
      // Sipariş ID gelmemişse direkt ana sayfaya gönder
      this.route.navigate(['/']);
    }
  }
}
