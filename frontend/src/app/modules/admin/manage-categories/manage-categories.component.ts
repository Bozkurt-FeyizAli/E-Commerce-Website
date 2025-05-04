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
  newCategory: Category = {
    name: '', description: '',
    id: 0
  };
  editingCategory: Category | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories() {
    this.adminService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Failed to fetch categories', err)
    });
  }

  submitCategory() {
    if (this.editingCategory) {
      this.adminService.updateCategory(this.editingCategory.id, this.newCategory)
        .subscribe(() => {
          this.fetchCategories();
          this.resetForm();
        });
    } else {
      this.adminService.createCategory(this.newCategory)
        .subscribe(() => {
          this.fetchCategories();
          this.resetForm();
        });
    }
  }

  editCategory(category: Category) {
    this.editingCategory = category;
    this.newCategory = { ...category };
  }

  deleteCategory(categoryId: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.adminService.deleteCategory(categoryId)
        .subscribe(() => this.fetchCategories());
    }
  }

  resetForm() {
    this.newCategory = { id: 0, name: '', description: '' };
    this.editingCategory = null;
  }
}
