import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { guardsGuard } from './core/guards.guard';
import { HttpClientModule } from '@angular/common/http'; // Ensure correct import

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    guardsGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
