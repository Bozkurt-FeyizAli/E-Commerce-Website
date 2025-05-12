import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { Product } from '@model/product';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '@model/category';

@Component({
  selector: 'app-manage-products',
  standalone: false,
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  displayedColumns: string[] = ['image', 'title', 'category', 'price', 'seller', 'status', 'actions'];
  dataSource = new MatTableDataSource<Product>();
  categories: Category[] = [];
  loading = true;
  searchQuery = '';
  selectedCategory = 'all';
  sellerFilter = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchCategories();
  }

  fetchProducts() {
    this.adminService.getAllProducts().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (err) => console.error('Failed to fetch products', err)
    });
  }

  fetchCategories() {
    this.adminService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Failed to fetch categories', err)
    });
  }

  applyFilters() {
    this.dataSource.filterPredicate = (data: Product, filter: string) => {
      const categoryMatch = this.selectedCategory === 'all' ||
                          data.category.name.toLowerCase() === this.selectedCategory;
      return categoryMatch;
    };
    this.dataSource.filter = 'trigger';
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(productId).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(p => p.id !== productId);
        },
        error: (err) => console.error('Failed to delete product', err)
      });
    }
  }
}


