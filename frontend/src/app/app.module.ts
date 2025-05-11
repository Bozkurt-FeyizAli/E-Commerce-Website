import { AuthService } from 'app/core/services/auth/auth.service';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { StorageService } from './core/services/storage/storage.service';
import { CoreModule, } from './core/core.module';
import { RouterModule } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NumberFormatPipe } from './shared/pipe/number-format.pipe';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';




// factory function to load user on app initialization
export function loadUserFactory(authService: AuthService) {
  return () => authService.loadCurrentUser();
}

// app.module.ts
@NgModule({
  declarations: [
    AppComponent,
    NumberFormatPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Sadece burada olmalı
    RouterModule.forRoot([]), // Temel router yapılandırması
    CoreModule,
    AppRoutingModule,
    SocialLoginModule,
    //NgxExtendedPdfViewerModule
  ],
  exports: [
    NumberFormatPipe
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      useFactory: loadUserFactory,
      deps: [AuthService],
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('616690897071-bagemhsi4ns0fr6u8gboe7nio5sk6p9h.apps.googleusercontent.com')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

