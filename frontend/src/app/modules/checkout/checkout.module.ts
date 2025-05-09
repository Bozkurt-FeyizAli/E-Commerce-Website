import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { OrderService } from './service/order.service';
import { DecimalPipe } from '@angular/common';
import { NumberFormatPipe } from '@pipe/number-format.pipe';

@NgModule({
  declarations: [
    CheckoutSuccessComponent,
    CheckoutComponent

  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterModule,
    CheckoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,





  ],
   providers: [
    OrderService,
    DecimalPipe,
    NumberFormatPipe


   ],
})
export class CheckoutModule { }
