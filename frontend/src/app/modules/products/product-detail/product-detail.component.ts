import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { Product } from '@models/product.model';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadProduct();  // Add this line to trigger loading
    });
  }

  private loadProduct(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || isNaN(+idParam)) {
      this.error = 'Invalid product ID';
      this.loading = false;
      return;
    }

    const id = +idParam;
    this.loading = true;
    this.error = null;

    this.productService.getProductById(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load product';
        this.loading = false;
      }
    });
  }

  onAdd(): void {
    if (this.product && this.product.stock > 0) {
      this.snackBar.open(`${this.product.name} added to cart!`, 'Dismiss', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/product-placeholder.png';
  }

  retry(): void {
    this.loadProduct();
  }

  goBack(): void {
    this.location.back();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
