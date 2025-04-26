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
  {
    path: 'cart',
    loadChildren: () => import('./modules/cart/cart.module').then(m => m.CartModule),
    canActivate: [guardsGuard]
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule)
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [guardsGuard]
  },

  { path: "**", redirectTo: "/products", pathMatch: "full" },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
