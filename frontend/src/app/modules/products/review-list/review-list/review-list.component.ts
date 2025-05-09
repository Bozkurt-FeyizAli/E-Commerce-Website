import { Component, Input, OnInit } from '@angular/core';
import { Review } from '@model/review';
import { ProductService } from '../../services/product.service';
import { AuthService } from 'app/core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

// review-list.component.ts (Yeni Dosya)
@Component({
  selector: 'app-review-list',
  standalone: false,
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  @Input() productId!: number;
  reviews: Review[] = [];
  newReview = { rating: 0, comment: '' };
  isLoggedIn = false;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadReviews();
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  loadReviews() {
    this.productService.getProductReviews(this.productId).subscribe({
      next: (reviews) => this.reviews = reviews,
      error: (err) => console.error('Yorumlar yüklenemedi:', err)
    });
  }

  submitReview() {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Yorum yapmak için giriş yapmalısınız', 'Kapat', { duration: 3000 });
      return;
    }

    this.productService.submitReview({
      productId: this.productId,
      rating: this.newReview.rating,
      comment: this.newReview.comment
    }).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.newReview = { rating: 0, comment: '' };
      },
      error: (err) => this.snackBar.open('Yorum gönderilemedi', 'Kapat', { duration: 3000 })
    });
  }
}
