import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { FormsModule } from '@angular/forms';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';





@NgModule({
  declarations: [
    AdminComponent,
    ManageUsersComponent,
    AdminDashboardComponent,
    ManageProductsComponent,
    ManageOrdersComponent,
    ManageCategoriesComponent



  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule



  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule { }
