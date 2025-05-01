import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
import { BannerComponent } from './banner/banner.component';
import { CategoryGridComponent } from './category-grid/category-grid.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { NewArrivalsComponent } from './new-arrivals/new-arrivals.component';

@NgModule({
  declarations: [
    HomeComponent,
    BannerComponent,
    CategoryGridComponent,
    FeaturedProductsComponent,
    NewArrivalsComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    HomeRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule { }
