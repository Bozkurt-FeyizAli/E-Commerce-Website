import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.inteceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { HeaderComponent } from 'app/shared/components/header/header.component';
import { FooterComponent } from 'app/shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CoreComponent } from './core.component';
@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // Diğer core servislerin varsa burada ekle
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    CoreComponent,

  ],
  imports: [
    CommonModule,
    RouterOutlet,
    // Diğer core modüllerini burada ekle

  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    RouterOutlet,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('⚠️ CoreModule has already been loaded. Import only in AppModule!');
    }
  }
}
