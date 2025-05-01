import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

const routes: Routes = [
  { path: '', component: SellerComponent, children: [
    { path: 'dashboard', component: AnalyticsComponent },
    { path: 'products', component: ProductManagementComponent },
    { path: 'orders', component: OrderManagementComponent },
    { path: 'shipments', component: ShipmentTrackingComponent },
    { path: 'reviews', component: ReviewManagementComponent },
    { path: 'payments', component: PaymentsComponent },
    { path: 'transactions', component: TransactionsComponent },
    { path: 'complaints', component: ComplaintsComponent },
    { path: 'profile', component: ProfileComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]}
];


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
    ProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class SellerModule { }
