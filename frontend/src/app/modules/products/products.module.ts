import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Ensure correct import
import { ProductsRoutingModule } from './module/products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductListComponent,
    ProductDetailComponent,
  ],
  imports: [
    ProductsRoutingModule,
    SharedModule,
    HttpClientModule // Ensure this is correctly imported
  ]
})
export class ProductsModule {
  // ...existing code...
}
