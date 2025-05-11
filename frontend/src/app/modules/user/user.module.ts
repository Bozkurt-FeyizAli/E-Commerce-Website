import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user.component';
import { RouterModule } from '@angular/router';
import { OrderViewComponent } from './order-view/order-view.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserRoutingModule } from './user-routing.module';



@NgModule({
  declarations: [UserComponent, OrderViewComponent, UserProfileComponent, UserEditComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    UserRoutingModule
  ],
  exports: [UserComponent, OrderViewComponent],
  providers: [],
})
export class UserModule { }
