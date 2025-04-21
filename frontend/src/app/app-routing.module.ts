import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { guardsGuard } from './core/guards.guard';

const routes: Routes = [
  // app-routing.module.ts

  {
    path: 'products',
    loadChildren: () => import('./modules/products/products.module').then(m => m.ProductsModule) // Lazy loading
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/module/auth.module').then(m => m.AuthModule)
  },
  // Cart modülü (Lazy Loading + Guard)
  {
    path: 'cart',
    loadChildren: () => import('./modules/cart/cart.module').then(m => m.CartModule),
    canActivate: [guardsGuard]
  },
  { path: "**", redirectTo: "/products", pathMatch: "full" },
  { path: "", redirectTo: "/products", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  router: any;
  goCart() {
    this.router.navigate(['/cart']);
  }
  goProducts() {
    this.router.navigate(['/products']);
  }
  goAuth() {
    this.router.navigate(['/auth']);
  }
  goHome() {
    this.router.navigate(['/']);
  }
  goLogin() {
    this.router.navigate(['/auth/login']);
  }
  goRegister() {
    this.router.navigate(['/auth/register']);
  }
  goProductDetail(id: number) {
    this.router.navigate(['/products', id]);
  }
  goProductDetailWithQuery(id: number) {
    this.router.navigate(['/products', id], { queryParams: { ref: '123' } });
  }
  goProductDetailWithFragment(id: number) {
    this.router.navigate(['/products', id], { fragment: 'top' });
  }
  goProductDetailWithState(id: number) {
    this.router.navigate(['/products', id], { state: { productId: id } });
  }
  goProductDetailWithHash(id: number) {
    this.router.navigate(['/products', id], { hash: '#top' });
  }
  goProductDetailWithQueryAndFragment(id: number) {
    this.router.navigate(['/products', id], { queryParams: { ref: '123' }, fragment: 'top' });
  }
  goProductDetailWithQueryAndState(id: number) {
    this.router.navigate(['/products', id], { queryParams: { ref: '123' }, state: { productId: id } });
  }
  goProductDetailWithFragmentAndState(id: number) {
    this.router.navigate(['/products', id], { fragment: 'top', state: { productId: id } });
  }
  goProductDetailWithQueryFragmentAndState(id: number) {
  }

}
