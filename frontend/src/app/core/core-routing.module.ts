
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { Role } from '../shared/models/role.enum';
import { CoreComponent } from './core.component';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      // Public Routes
      {
        path: 'auth',
        loadChildren: () => import('../modules/auth/module/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'user',
        loadChildren: () => import('../modules/user/user.module').then(m => m.UserModule)
      },

      // Protected Routes
      {
        path: 'products',
        loadChildren: () => import('../modules/products/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('../modules/cart/cart.module').then(m => m.CartModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.User, Role.Seller, Role.Admin] }
      },
      {
        path: 'seller',
        loadChildren: () => import('../modules/seller/seller.module').then(m => m.SellerModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Seller, Role.Admin] }
      },
      {
        path: 'admin',
        loadChildren: () => import('../modules/admin/admin.module').then(m => m.AdminModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
      },
      {
        path: 'profile',
        loadChildren: () => import('../modules/user/user.module').then(m => m.UserModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.User, Role.Seller, Role.Admin] }
      },

      // Default & Error Routes
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'not-found',
        loadChildren: () => import('../modules/error-pages/not-found/not-found.module').then(m => m.NotFoundModule)
      },
      {
        path: 'unauthorized',
        loadChildren: () => import('../modules/error-pages/unauthorized/unauthorized.module').then(m => m.UnauthorizedModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
