import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { Product } from '@model/product.model';
import { Subject, takeUntil, of } from 'rxjs';
import { Category } from '@models/category.model';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  categories: Category[] = []; // `Category[]` tipinde başlatıldı
  searchTerm: string = ''; // Arama terimi başlatıldı
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private location: Location,
    private cdr: ChangeDetectorRef // ChangeDetectorRef eklendi
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadProduct();  // Yükleme fonksiyonunu çağır
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
        this.cdr.detectChanges(); // Değişiklikleri tetikle
      },
      error: (err) => {
        this.error = err.message || 'Failed to load product';
        this.loading = false;
        this.cdr.detectChanges(); // Değişiklikleri tetikle
      }
    });
  }



  onSearch(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.searchTerm = selectElement.value; // Arama terimini güncelle
    this.productService.searchProducts(this.searchTerm).subscribe(
      products => {
        this.categories = products.map(product => product.category); // Kategoriler
      }
    );
  }

  onFilterCategory(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCategory = selectElement.value; // Seçilen kategori değeri
    this.productService.filterByCategory(selectedCategory).subscribe(
      products => {
        this.categories = products.map(product => product.category); // Kategorilere göre filtreleme
      }
    );
  }




  // Arama terimini sıfırlama
  onClearSearch(): void {
    this.searchTerm = '';
    this.loadProduct(); // Tüm ürünleri yeniden yükle
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
    (event.target as HTMLImageElement).src = 'assets/images/product-placeholder.png'; // Placeholder kullan
  }

  retry(): void {
    this.loadProduct(); // Yüklemeyi yeniden başlat
  }

  goBack(): void {
    this.location.back(); // Geri git
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete(); // Observable stream’ini temizle
  }
}
