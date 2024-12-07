import { NgModule } from '@angular/core';
import {
  BrowserModule,

} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DemoAngularMaterialModule } from './DemoAngularMaterialModule';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import {

  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';

import { EmployeeModule } from './modules/employee/employee.module';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ProfileComponent } from './profile/profile.component';
import {
  SocialLoginModule,

  GoogleSigninButtonModule,

} from '@abacritt/angularx-social-login';

import { OAuthModule } from 'angular-oauth2-oidc';
import {MSAL_INSTANCE, MsalModule, MsalService} from "@azure/msal-angular";
import {IPublicClientApplication, PublicClientApplication} from "@azure/msal-browser";
import { TestComponent } from './auth/components/test/test.component';
import {FullCalendarModule} from "@fullcalendar/angular";

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '104d805b-e570-4e61-a420-90e56e85fb6b',
      authority: 'https://login.microsoftonline.com/81a0390f-c570-46a0-9304-d10d2bf7aaeb',
      redirectUri: 'http://localhost:4200/employee/dashboard'
    },
    cache: {
      cacheLocation: 'localStorage',  // Store tokens in local storage
      storeAuthStateInCookie: false,
    },
  });
}


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoAngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    HttpClientModule,
    EmployeeModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    OAuthModule.forRoot(),
    MsalModule,
    FullCalendarModule,

  ],
  providers: [

    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory

    },
    MsalService,
    provideHttpClient(withFetch()),
    provideCharts(withDefaultRegisterables()),



  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
