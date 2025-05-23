import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    UnauthorizedComponent
  ],
  imports: [
    CommonModule,
    MatIconModule // Ensure MatIconModule is correctly imported
  ]
})
export class UnauthorizedModule { }
