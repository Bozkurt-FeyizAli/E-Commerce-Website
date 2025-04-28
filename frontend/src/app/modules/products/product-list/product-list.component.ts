import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../../cart/service/cart.service';
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

  searchQuery = '';
  showFilters = false;
  viewMode: 'grid' | 'list' = 'grid';

  categories = ['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books']; // You can later fetch dynamically
  brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony']; // Same for brands

  filters = {
    category: [] as string[],
    brand: [] as string[],
    priceRange: [0, 1000] as [number, number],
    inStock: false
  };
  filteredProducts: Product[] = [];


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

  onSearch(): void {
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  oggleFilter(type: 'category' | 'brand', value: string): void {
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

  // onSearch(term: string): void {
  //   this.loading = true;
  //   this.productService.searchProducts(term).pipe(
  //     finalize(() => this.loading = false)
  //   ).subscribe(products => this.products = products);
  // }

  onFilterCategory(cat: string): void {
    this.loading = true;
    this.productService.filterByCategory(cat).pipe(
      finalize(() => this.loading = false)
    ).subscribe(products => this.products = products);
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
                               this.filters.category.includes(product.category.toString());


      const matchesPrice = product.price <= this.filters.priceRange[1];

      const matchesStock = !this.filters.inStock || product.stock;

      return matchesSearch && matchesCategory  && matchesPrice && matchesStock;
    });
  }

}
