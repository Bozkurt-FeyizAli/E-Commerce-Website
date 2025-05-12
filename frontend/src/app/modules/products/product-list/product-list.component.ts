import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../../cart/service/cart.service';
import { Product } from '@model/product';
import { catchError, finalize, of, Subject, takeUntil, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/core/services/auth/auth.service';
import { Category } from '@model/category';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];

  loading = true;
  error: string | null = null;

  // Arama ve filtreleme için:
  searchQuery = '';
  showFilters = false;
  viewMode: 'grid' | 'list' = 'grid';

  brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony'];

  filters = {
    category: [] as string[],
    brand: [] as string[],
    priceRange: [0, 100000] as [number, number],
    inStock: false
  };

  private destroy$ = new Subject<void>();
  selectedQty: Record<number, number> = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  private loadCategories(): void {
    this.productService.getCategories().pipe(
      tap((categories) => {
        this.categories = categories;
        this.filters.category = [];
        this.cdr.detectChanges();
      }),
      catchError((err) => {
        console.error('Kategori yükleme hatası:', err);
        return of([]);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getProducts().pipe(
      tap((products) => {
        this.products = products;
        this.applyFilters();  // Ürünler geldikten sonra filtre uygula
        this.loading = false;
        this.cdr.detectChanges();
      }),
      catchError((err) => {
        console.error('Ürün yükleme hatası:', err);
        this.error = 'Ürünler yüklenemedi. Lütfen daha sonra tekrar deneyin.';
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  addToCart(product: Product): void {
    const qty = this.selectedQty[product.id] ?? 1;
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Sepete eklemek için giriş yapmalısınız!', 'Kapat', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (product.stock > 0) {
      this.cartService.addToCart(product, qty).subscribe({
        next: () => {
          this.snackBar.open(`${product.name} sepete eklendi!`, 'Kapat', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (err) => {
          console.error('Sepete ekleme hatası:', err);
          this.snackBar.open('Sepete ekleme başarısız oldu.', 'Kapat', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.snackBar.open('Ürün stokta yok.', 'Kapat', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  // addMultipleToCart(products: { product: Product; quantity: number }[]): void {
  //   const userId = this.authService.getUserId();
  //   if (!userId) {
  //     this.snackBar.open('Sepete eklemek için giriş yapmalısınız!', 'Kapat', {
  //       duration: 3000,
  //       panelClass: ['error-snackbar']
  //     });
  //     return;
  //   }

  //   const cartItems = products.map(p => ({
  //     productId: p.product.id,
  //     quantity: p.quantity,
  //   }));

  //   this.cartService.addMultipleToCart(products).subscribe({
  //     next: () => {
  //     this.snackBar.open('Ürünler sepete eklendi!', 'Kapat', {
  //       duration: 3000,
  //       panelClass: ['success-snackbar']
  //     });
  //     },
  //     error: (err) => {
  //     console.error('Toplu sepete ekleme hatası:', err);
  //     this.snackBar.open('Ürünler sepete eklenemedi.', 'Kapat', {
  //       duration: 3000,
  //       panelClass: ['error-snackbar']
  //     });
  //     }
  //   });
  // }


  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    this.cdr.detectChanges(); // Güncellemeyi zorla
  }


  toggleFilter(type: 'category' | 'brand', value: string): void {
    const list = this.filters[type];
    const index = list.indexOf(value);
    if (index === -1) {
      list.push(value);
    } else {
      list.splice(index, 1);
    }
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProducts = this.getFilteredProducts();
  }

  getFilteredProducts(): Product[] {
    return this.products.filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            product.description?.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory = this.filters.category.length === 0 ||
                              (product.category && this.filters.category.includes(product.category.name));

      const matchesBrand = this.filters.brand.length === 0;

      const matchesPrice = product.price >= this.filters.priceRange[0] &&
                           product.price <= this.filters.priceRange[1];

      const matchesStock = !this.filters.inStock || product.stock > 0;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock;
    });
  }


  onFilterCategory(categoryName: string): void {
    this.loading = true;
    this.productService.filterByCategory(categoryName).pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }),
      takeUntil(this.destroy$)
    ).subscribe(products => {
      this.products = products;
      this.applyFilters();
    });
  }

  retryLoading(): void {
    this.loadProducts();
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;

    img.alt = 'Placeholder image';
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  incQty(p: Product) {
    const current = this.selectedQty[p.id] ?? 1;
    if (current < p.stock)     // stok kadar sınırla
      this.selectedQty[p.id] = current + 1;
  }

  decQty(p: Product) {
    const current = this.selectedQty[p.id] ?? 1;
    this.selectedQty[p.id] = Math.max(current - 1, 1);
  }
}
