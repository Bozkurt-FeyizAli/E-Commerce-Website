import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart.component';
import { guardsGuard } from '../../core/guards.guard'; // AuthGuard'ı import et

const routes: Routes = [
  {
    path: '',
    component: CartComponent,
    canActivate: [guardsGuard] // Sadece giriş yapanlar erişebilir
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
