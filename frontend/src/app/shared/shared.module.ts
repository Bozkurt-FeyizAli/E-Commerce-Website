import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Menu, X, Search, Heart, ShoppingCart, User } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { RoleDirective } from './directives/role.directive';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    RoleDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule.pick({ Menu, X, Search, Heart, ShoppingCart, User }),
    RouterModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    FormsModule,
    LucideAngularModule,
    RoleDirective,
    RouterModule,
  ]
})
export class SharedModule { }
