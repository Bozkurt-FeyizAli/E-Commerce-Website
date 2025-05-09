import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SellerComponent } from './seller.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { ShipmentTrackingComponent } from './shipment-tracking/shipment-tracking.component';
import { ReviewManagementComponent } from './review-management/review-management.component';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './analytics/analytics.component';
import { PaymentsComponent } from './payments/payments.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SellerRoutingModule } from './seller-routing.module';



@NgModule({
  declarations: [
    SellerComponent,
    ProductManagementComponent,
    OrderManagementComponent,
    ShipmentTrackingComponent,
    ReviewManagementComponent,
    AnalyticsComponent,
    PaymentsComponent,
    TransactionsComponent,
    ComplaintsComponent,
    ProfileComponent,
    DashboardComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SellerRoutingModule
  ]
})
export class SellerModule { }
