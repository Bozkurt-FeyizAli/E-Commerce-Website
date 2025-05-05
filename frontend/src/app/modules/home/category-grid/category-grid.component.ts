import { Component, OnInit } from '@angular/core';
import { Category } from '@model/category';
import { HomeService } from '../service/home.service';

@Component({
  selector: 'app-category-grid',
  standalone: false,
  templateUrl: './category-grid.component.html',
  styleUrls: ['./category-grid.component.css']
})
export class CategoryGridComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  error: string | null = null;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load categories.';
        console.error(err);
        this.loading = false;
      }
    }); 
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/category-placeholder.png';
  }
}
