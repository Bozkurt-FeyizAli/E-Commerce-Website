import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../../../shared/services/cart.service';
import { Product } from '../../../shared/models/product.model';
import { catchError, finalize, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getProducts().pipe(
      tap((products) => {
        this.products = products;
        this.loading = false;
        this.cdr.detectChanges();
      }),
      catchError((err) => {
        this.loading = false;
        this.error = 'Failed to load products. Please try again later.';
        console.error('Product loading error:', err);
        this.cdr.detectChanges();
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe();
  }

  addToCart(product: Product): void {
    if (!product.stock) return;

    this.cartService.addToCart(product).subscribe({
      next: () => this.showSuccessNotification(product),
      error: (err) => this.showErrorNotification(err)
    });
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/placeholder.png';
    img.alt = 'Placeholder image';
  }

  retryLoading(): void {
    this.loadProducts();
  }

  private showSuccessNotification(product: Product): void {
    this.snackBar.open(
      `${product.name} added to cart!`,
      'Dismiss',
      {
        duration: 3000,
        panelClass: ['success-snackbar']
      }
    );
  }

  private showErrorNotification(error: any): void {
    console.error('Cart error:', error);
    this.snackBar.open(
      'Failed to add item to cart. Please try again.',
      'Dismiss',
      {
        duration: 5000,
        panelClass: ['error-snackbar']
      }
    );
  }
}
