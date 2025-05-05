import { Component, OnInit } from '@angular/core';
import { CategoryService } from './service/category.service';
import { Category } from '@model/category';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categories: Category[] = [];
  isLoading = false;
  error: string = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.fetchCategories();
    console.log('✅ CategoryComponent INIT başladı');

  }

  fetchCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load categories';
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}
