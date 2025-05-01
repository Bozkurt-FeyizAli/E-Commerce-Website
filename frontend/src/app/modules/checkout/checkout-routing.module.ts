import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'success',
    component: CheckoutSuccessComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule {}
