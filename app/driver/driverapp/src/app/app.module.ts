import { StatusWorkPage } from './../pages/status-work/status-work';
// import { AddVanPage } from './../pages/add-van/add-van';
import { AccountPage } from './../pages/account/account';
import { UpdatePage } from './../pages/update/update';
import { TabsPage } from './../pages/tabs/tabs';
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
import { PopoverComponent } from './../components/popover/popover';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';

@NgModule({
  declarations: [
    MyApp,
    HomePage,LoginPage,TabsPage,UpdatePage,AccountPage,StatusWorkPage,
    PopoverComponent
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
    HomePage,LoginPage,TabsPage,UpdatePage,AccountPage,StatusWorkPage,
    PopoverComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,BackgroundMode,
    LocationTrackerProvider
  ]
})
export class AppModule {}
