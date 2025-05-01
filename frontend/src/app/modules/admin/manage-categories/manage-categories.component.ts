import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { Category } from '@model/category';

@Component({
  selector: 'app-manage-categories',
  standalone: false,
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.css']
})
export class ManageCategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  error = '';

  newCategory: Category = {
    id: 0,
    name: '',
    description: '',
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories() {
    this.adminService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch categories', err);
        this.error = 'Failed to load categories.';
        this.loading = false;
      }
    });
  }

  addCategory() {
    if (!this.newCategory.name) {
      alert('Category name is required.');
      return;
    }
    this.adminService.createCategory(this.newCategory).subscribe({
      next: (category) => {
        this.categories.push(category);
        this.newCategory = { id: 0, name: '', description: ''};
      },
      error: (err) => {
        console.error('Failed to create category', err);
      }
    });
  }

  deleteCategory(categoryId: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.adminService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== categoryId);
        },
        error: (err) => {
          console.error('Failed to delete category', err);
        }
      });
    }
  }
}
