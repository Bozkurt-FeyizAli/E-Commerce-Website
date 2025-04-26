// core/core.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { CoreRoutingModule } from './core-routing.module';
import { HeaderComponent } from 'app/shared/components/header/header.component';
import { FooterComponent } from 'app/shared/components/footer/footer.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { StorageService } from './services/storage/storage.service';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AuthGuard } from './guards/auth.guard';
import { RouterModule } from '@angular/router';

// core.module.ts
@NgModule({
  declarations: [CoreComponent, ],
  imports: [
    CommonModule,
    SharedModule,
    CoreRoutingModule,
    HttpClientModule,
    RouterModule

  ],
  exports: [HeaderComponent, FooterComponent]
})
export class CoreModule {}
