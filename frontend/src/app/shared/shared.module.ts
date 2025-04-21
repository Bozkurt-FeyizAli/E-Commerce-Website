import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Menu, X, Search, Heart, ShoppingCart, User } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoadingSpinnerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule, // ✅ BURAYA EKLENDİ
    LucideAngularModule.pick({ Menu, X, Search, Heart, ShoppingCart, User }),
    RouterModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    FormsModule // bu da kalsın, dışarıdan da kullanılacaksa
  ]
})
export class SharedModule { }
