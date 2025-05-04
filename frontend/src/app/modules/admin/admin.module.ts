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
import { TimeAgoPipe } from "@pipe/timeAgoPipe";
import { TruncatePipe } from '@pipe/truncatePipe';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';

import { ReactiveFormsModule } from '@angular/forms';
import { FormatActivityTypePipe } from '@pipe/formatActivityType';

import { MatMenuModule } from '@angular/material/menu';
//import { NgChartsModule } from 'ng2-charts';

// Components
import { ManageComplaintsComponent } from './manage-complaints/manage-complaints.component';




@NgModule({
  declarations: [
    AdminComponent,
    ManageUsersComponent,
    AdminDashboardComponent,
    ManageProductsComponent,
    ManageOrdersComponent,
    ManageCategoriesComponent,
    TimeAgoPipe,
    ManageComplaintsComponent,
    TruncatePipe,
    FormatActivityTypePipe
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    // Material Modules
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatMenuModule
  ]
  // Remove schemas: [CUSTOM_ELEMENTS_SCHEMA] (not needed with proper imports)
})
export class AdminModule { }
