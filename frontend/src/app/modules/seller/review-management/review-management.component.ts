import { Component } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { Review } from '@model/review';

@Component({
  selector: 'app-review-management',
  standalone: false,
  templateUrl: './review-management.component.html',
  styleUrls: ['./review-management.component.css']
})
export class ReviewManagementComponent {
  reviews: Review[] = [];
  productId: number = 1;  // Şimdilik sabit, ileride dinamik alınabilir
  isLoading = false;
  errorMessage = '';

  constructor(private sellerService: SellerService) {}

  fetchReviews(): void {
    this.isLoading = true;
    this.sellerService.getProductReviews(this.productId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Yorumlar yüklenirken hata oluştu.';
        this.isLoading = false;
      }
    });
  }
}
