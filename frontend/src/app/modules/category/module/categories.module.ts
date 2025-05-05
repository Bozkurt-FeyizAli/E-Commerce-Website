import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from '../category.component';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryDetailComponent } from '../category-detail/category-detail.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [CategoryComponent, CategoryDetailComponent],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    MatProgressSpinnerModule,
    FormsModule
  ]

})
export class CategoriesModule {}
