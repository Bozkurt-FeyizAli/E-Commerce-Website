import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { Product } from '@model/product';
import { Subject, takeUntil, switchMap, of } from 'rxjs';
import { ProductImage } from '@model/product-image';
import { CartService } from 'app/modules/cart/service/cart.service';
import { AuthService } from 'app/core/services/auth/auth.service'; // ✅ Eklendi

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
  productImages: ProductImage[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    private authService: AuthService // ✅ Eklendi
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
          return of(null);
        }

        const id = +idParam;
        this.loading = true;
        this.error = null;

        return this.productService.getProductById(id);
      })
    ).subscribe({
      next: (product) => {
        if (!product) return;
        this.product = product;
        this.loading = false;
        this.cdr.detectChanges();

        this.productService.getProductImages(product.id).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (images) => {
            this.productImages = images;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        this.error = err.message || 'Failed to load product';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getDiscountedPrice(price: number, discountPercentage: number): number {
    return price * (1 - discountPercentage / 100);
  }

  getStarFillPercentage(position: number, rating: number): number {
    if (rating >= position) {
      return 100;
    } else if (rating > position - 1) {
      return (rating - (position - 1)) * 100;
    }
    return 0;
  }

  onAdd(): void {
    console.log('Add to Cart butonuna basıldı 🚀');

    if (!this.authService.isLoggedIn()) {  // ✅ Doğru AuthService check
      console.log('Giriş yapılmamış ❌');
      this.snackBar.open('Sepete eklemek için giriş yapmalısınız!', 'Kapat', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (!this.product) {
      console.log('Ürün bulunamadı ❌');
      return;
    }

    if (this.product.stock > 0) {
      console.log('Ürün sepete ekleniyor... ✅', this.product);

      this.cartService.addToCart(this.product, 1).subscribe({
        next: () => {
          console.log('Sepete eklendi 🚀');
          this.snackBar.open(`${this.product?.name} sepete eklendi!`, 'Kapat', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (err) => {
          console.error('Sepete ekleme hatası ❌', err);
          this.snackBar.open(`Sepete ekleme başarısız oldu: ${err.error?.message || err.message}`, 'Kapat', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      console.log('Stokta yok ❌');
      this.snackBar.open('Ürün stokta yok.', 'Kapat', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/product-placeholder.png';
  }

  retry(): void {
    this.loadProduct(); // Opsiyonel: yeniden yükleme
  }

  goBack(): void {
    this.location.back();
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

        this.productService.getProductImages(product.id).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (images) => {
            this.productImages = images;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        this.error = err.message || 'Failed to load product';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
