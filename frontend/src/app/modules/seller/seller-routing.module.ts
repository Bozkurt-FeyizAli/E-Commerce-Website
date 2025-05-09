import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductManagementComponent } from './product-management/product-management.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { ShipmentTrackingComponent } from './shipment-tracking/shipment-tracking.component';
import { ReviewManagementComponent } from './review-management/review-management.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { PaymentsComponent } from './payments/payments.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'products', component: ProductManagementComponent },
  { path: 'orders', component: OrderManagementComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'complaints', component: ComplaintsComponent },
  { path: 'reviews', component: ReviewManagementComponent },
  { path: 'shipments', component: ShipmentTrackingComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: '**', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule {}
