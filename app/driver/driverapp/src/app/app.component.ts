import { LoginPage } from './../pages/login/login';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import * as Enums from '../enums/enums';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { BackgroundMode } from '@ionic-native/background-mode';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private geolocation: Geolocation,
    private storage: Storage,public http: Http,private backgroundMode: BackgroundMode) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.loadLocationUpdate();
    });
  }

  loadLocationUpdate(){
    if (!this.backgroundMode.isEnabled()){
    this.storage.get('accountdriver').then((data)=>{
      if(data == null){
          let options = {
          frequency: 2000,
          enableHighAccuracy: true,
        };

        let watch = this.geolocation.watchPosition(options);
        watch.subscribe((data) => {
          let locationupdate = {
            lat: data.coords.latitude,
            log: data.coords.longitude
          }
          this.storage.set('location',locationupdate)
        });

      }else{
        let options = {
          frequency: 3000,
          enableHighAccuracy: true
        };
        let watch = this.geolocation.watchPosition(options);
        watch.subscribe((latLng) => {
          this.backgroundMode.enable()
          this.backgroundMode.moveToForeground();
          this.backgroundMode.disableWebViewOptimizations();;
          this.backgroundMode.isActive();
        let url = Enums.APIURL.URL+'/locationupdate/lat='+latLng.coords.latitude+'&&lng='+latLng.coords.longitude+'&&license='+data.datavan;
        this.http.get(url).map((res)=>res.json()).subscribe((res:any)=>{
            console.log(res);
        });

        });
      }
    });
  }
}//endfuntion

}//end

