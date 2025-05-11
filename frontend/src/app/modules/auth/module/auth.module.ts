import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from '../auth.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SafePipe } from '@pipe/SafePipe';
@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent

  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule,
    SafePipe
  ],
  exports: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    NgxExtendedPdfViewerModule,
    SafePipe
  ],
})
export class AuthModule { }
