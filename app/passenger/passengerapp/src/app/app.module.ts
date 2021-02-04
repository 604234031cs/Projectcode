import { MapsPage } from './../pages/maps/maps';
import { ListDriverPage } from './../pages/list-driver/list-driver';
import { ProfileDriverPage } from './../pages/profile-driver/profile-driver';
import { TrakVanLicensePage } from './../pages/trak-van-license/trak-van-license';
import { PoinPassPage } from './../pages/poin-pass/poin-pass';
import { PopoverComponent } from './../components/popover/popover';
import { LicensePage } from './../pages/license/license';
import { RoutePage } from './../pages/route/route';
import { AccountPage } from './../pages/account/account';
import { TrackPage } from './../pages/track/track';
import { RegisPage } from './../pages/regis/regis';
import { LoginPage } from './../pages/login/login';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';
import { Geolocation } from '@ionic-native/geolocation';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { CallNumber } from '@ionic-native/call-number';

@NgModule({
  declarations: [
    MyApp,
    HomePage,LoginPage,RegisPage,AccountPage,TrackPage,TabsPage,RoutePage,LicensePage,PoinPassPage,TrakVanLicensePage,ProfileDriverPage,ListDriverPage,MapsPage,PopoverComponent,ForgotPasswordPage
  ],
  imports: [
    HttpModule,
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,LoginPage,RegisPage,TrackPage,AccountPage,TabsPage,RoutePage,LicensePage,PoinPassPage,TrakVanLicensePage,ProfileDriverPage,ListDriverPage,MapsPage,ForgotPasswordPage
    ,PopoverComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},Geolocation,LocalNotifications,BackgroundMode,CallNumber
  ]
})
export class AppModule {}
