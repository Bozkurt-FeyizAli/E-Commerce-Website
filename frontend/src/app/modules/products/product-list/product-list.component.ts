import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../../cart/service/cart.service';
import { Product } from '../../../shared/models/product';
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
  loading = true;
  error: string | null = null;

  searchQuery = '';
  showFilters = false;
  viewMode: 'grid' | 'list' = 'grid';

  // Opsiyonel: backend'den dinamik çekebilirsin ama şimdilik statik
  categories: Category[] = [];
  brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony'];;

  filters = {
    category: [] as string[],
    brand: [] as string[],
    priceRange: [0, 100000] as [number, number],
    inStock: false
  };
  filteredProducts: Product[] = [];

  private destroy$ = new Subject<void>();

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

  loadCategories(): void {
    this.productService.getCategories().pipe(
      tap((categories) => {
        this.categories = categories;
        this.filters.category = [];
        this.cdr.detectChanges();
      }),
      catchError((err) => {
        console.error('Category loading error:', err);
        return of([]);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }



  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getProducts().pipe(
      tap((products) => {
        this.products = products;
        this.applyFilters();  // İlk başta tüm ürünler gösterilsin
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
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  addToCart(product: Product): void {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Please log in to add items to your cart.', 'Dismiss', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    if (!product.stock) return;

    this.cartService.addToCart(product).subscribe({
      next: () => this.showSuccessNotification(product),
      error: (err) => this.showErrorNotification(err)
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
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

  applyFilters(): void {
    this.filteredProducts = this.getFilteredProducts();
  }

  onFilterCategory(cat: string): void {
    this.loading = true;
    this.productService.filterByCategory(cat).pipe(
      finalize(() => this.loading = false),
      takeUntil(this.destroy$)
    ).subscribe(products => {
      this.products = products;
      this.applyFilters();
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

  getFilteredProducts(): Product[] {
    return this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            product.description?.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory = this.filters.category.length === 0 ||
                              this.filters.category.includes(product.category?.name || '');

      const matchesBrand = this.filters.brand.length === 0 ||
                           this.filters.brand.includes(product.productDetails || ''); // productDetails'ı marka olarak kullanıyorsan

      const matchesPrice =
        product.price >= this.filters.priceRange[0] &&
        product.price <= this.filters.priceRange[1];

      const matchesStock = !this.filters.inStock || product.stock > 0;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
