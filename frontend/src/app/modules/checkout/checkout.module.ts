import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner.d-DRWEU4qb';
import { MatIcon } from '@angular/material/icon-module.d-BeibE7j0';
import { RouterModule } from '@angular/router';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    CheckoutComponent,
    CheckoutSuccessComponent,



  ],
  imports: [
    CommonModule,
    MatProgressSpinner,
    MatIcon,
    RouterModule,
    CheckoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule

  ]
})
export class CheckoutModule { }
