import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/core/guards/auth.guard';
import { UserComponent } from './user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { OrderViewComponent } from './order-view/order-view.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent, // Bu senin layout componentin gibi çalışmalı
    canActivate: [AuthGuard],
    children: [
      {  path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: UserProfileComponent },
      { path: 'edit', component: UserEditComponent },
      { path: 'orders/:id', component: OrderViewComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
