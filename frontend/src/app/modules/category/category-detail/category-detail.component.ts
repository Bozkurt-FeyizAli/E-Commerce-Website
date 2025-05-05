import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../service/category.service';
import { ProductService } from 'app/modules/products/services/product.service';
import { Category } from '@model/category';
import { Product } from '@model/product';
import { CartService } from 'app/modules/cart/service/cart.service';

@Component({
  selector: 'app-category-detail',
  standalone: false,
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {

  category!: Category;
  products: Product[] = [];
  sortOption: string = 'newest';
  isLoading = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const categoryId = Number(this.route.snapshot.paramMap.get('id'));
    if (categoryId) {
      this.loadCategory(categoryId);
      this.loadProducts(categoryId);
    }
  }

  loadCategory(id: number): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (data) => {
        this.category = data;
      },
      error: (err) => {
        console.error('Failed to load category', err);
        this.error = 'Category not found.';
      }
    });
  }

  loadProducts(categoryId: number): void {
    this.isLoading = true;
    this.productService.getProductsByCategory(categoryId, this.sortOption).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.error = 'Failed to load products.';
        this.isLoading = false;
      }
    });
  }

  onSortChange(): void {
    if (this.category?.id) {
      this.loadProducts(this.category.id);
    }
  }


addToCart(product: Product) {
  this.cartService.addToCart(product).subscribe({
    next: () => {
      console.log(`✅ ${product.name} added to cart.`);
      // isteğe bağlı: başarı mesajı göster
    },
    error: (err) => {
      console.error('❌ Error adding to cart:', err);
      // isteğe bağlı: hata mesajı göster
    }
  });
}


}
