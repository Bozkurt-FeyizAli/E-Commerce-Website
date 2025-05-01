import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../service/category.service';
import { Product } from '@models/product';
import { Category } from '@models/category';

@Component({
  selector: 'app-category-detail',
  standalone: false,
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {
  category: Category | null = null;
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.error = 'Invalid category ID';
      this.loading = false;
      return;
    }

    this.loadCategoryAndProducts(id);
  }

  private loadCategoryAndProducts(id: number): void {
    this.loading = true;
    this.categoryService.getCategoryById(id).subscribe({
      next: (category) => {
        this.category = category;
        this.products = []; // Eğer products backend'den geliyorsa
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load category.';
        this.loading = false;
      }
    });
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/product-placeholder.png';
  }
}
