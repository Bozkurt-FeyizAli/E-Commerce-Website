import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { ManageComplaintsComponent } from './manage-complaints/manage-complaints.component';


const routes: Routes = [{ path: '', component: AdminDashboardComponent },
  { path: 'users', component: ManageUsersComponent },
  { path: 'products', component: ManageProductsComponent },
  { path: 'categories', component: ManageCategoriesComponent },
  { path: 'orders', component: ManageOrdersComponent },
  { path: 'complaints', component: ManageComplaintsComponent }





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
