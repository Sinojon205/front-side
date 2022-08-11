import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {AddServerComponent} from './components/add-server/add-server.component';
import {LoginComponent} from './components/login/login.component';
import {ServerComponent} from './components/server/server.component';
import {Interceptor} from "./http-intercepors/interceptor";

@NgModule({
  declarations: [
    AppComponent,
    AddServerComponent,
    LoginComponent,
    ServerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
