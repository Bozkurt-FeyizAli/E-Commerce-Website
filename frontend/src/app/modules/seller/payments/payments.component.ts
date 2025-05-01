import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { Payment } from '@model/payment';

@Component({
  selector: 'app-payments',
  standalone: false,
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    this.fetchPayments();
  }

  fetchPayments(): void {
    this.isLoading = true;
    this.sellerService.getMyPayments().subscribe({
      next: (data) => {
        this.payments = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Ödemeler yüklenirken hata oluştu.';
        this.isLoading = false;
      }
    });
  }
}
