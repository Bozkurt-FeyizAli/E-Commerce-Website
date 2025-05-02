import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { Product } from '@model/product';
import { Subject, takeUntil, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

ngOnInit(): void {
  this.route.paramMap.pipe(
    takeUntil(this.destroy$),
    switchMap(params => {
      const idParam = params.get('id');

      if (!idParam || isNaN(+idParam)) {
        this.error = 'Invalid product ID';
        this.loading = false;
        this.cdr.detectChanges();
        return of(null); // 🚨 Hatalıysa boş dön
      }

      const id = +idParam;
      this.loading = true;
      this.error = null;

      return this.productService.getProductById(id);
    })
  ).subscribe({
    next: (product) => {
      if (!product) return;  // Hatalıysa işleme girme
      this.product = product;
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.error = err.message || 'Failed to load product';
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

  private loadProduct(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || isNaN(+idParam)) {
      this.error = 'Invalid product ID';
      this.loading = false;
      this.cdr.detectChanges();
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.message || 'Failed to load product';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onAdd(): void {
    if (this.product && this.product.stock > 0) {
      this.snackBar.open(`${this.product.name} sepete eklendi!`, 'Kapat', {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
