import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { ManageComplaintsComponent } from './manage-complaints/manage-complaints.component';
import { AuthGuard } from 'app/core/guards/auth.guard';
import { RoleGuard } from 'app/core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'ROLE_ADMIN' }
  },
  {
    path: 'users',
    component: ManageUsersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'ROLE_ADMIN' }
  },
  {
    path: 'products',
    component: ManageProductsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'ROLE_ADMIN' }
  },
  {
    path: 'categories',
    component: ManageCategoriesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'ROLE_ADMIN' }
  },
  {
    path: 'orders',
    component: ManageOrdersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'ROLE_ADMIN' }
  },
  {
    path: 'complaints',
    component: ManageComplaintsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'ROLE_ADMIN' }
  },
  {
    path: 'unauthorized',
    loadChildren: () => import('app/modules/error-pages/unauthorized/unauthorized.module').then(m => m.UnauthorizedModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
