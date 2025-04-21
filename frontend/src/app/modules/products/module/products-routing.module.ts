import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from '../products.component';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductListComponent } from '../product-list/product-list.component';

const routes: Routes = [
  {
    path: '',  // This is the route within the lazy-loaded module
    component: ProductsComponent,
    children: [
      { path: '', component: ProductListComponent },  // Default child route
      { path: ':id', component: ProductDetailComponent }  // Detail route
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
