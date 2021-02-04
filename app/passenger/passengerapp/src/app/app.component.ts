import { Http } from '@angular/http';
import { LoginPage } from './../pages/login/login';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import * as Enums from '../enums/enums';
import 'rxjs/add/operator/map';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
// declare var google: any;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;
  interval;
  showlocation;
  arry=[];
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private geolocation: Geolocation,private localNotifications: LocalNotifications,
    private storage: Storage,public http:Http,private backgroundMode: BackgroundMode) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.getPosition();
      this.driverTrack();
      this.NotiStatus();
      this.NotiDiract();
    });
  }




  getPosition(){
    var options = {
      enableHighAccuracy: true,
      frequency: 3000,
     };
    let watch = this.geolocation.watchPosition(options);
    watch.subscribe((data) => {
      let posistion = {
        lat:data.coords.latitude,
        lng:data.coords.longitude
      }
      this.storage.set("LocalPosition",posistion)
    });
  }


  driverTrack(){
    this.interval=setInterval(()=>{
        this.storage.get('trackvan').then((statustrack:any)=>{
            if(statustrack != null){
                if(statustrack['status'] ==1){
                  let url = Enums.APIURL.URL + '/stutuscheck/'+ statustrack['driver_id'];
                    this.http.get(url).map(res=>res.json()).subscribe((respons)=>{
                      this.backgroundMode.enable()
                      // this.backgroundMode.wakeUp();
                      // this.backgroundMode.unlock();
                      this.backgroundMode.moveToForeground();
                      this.backgroundMode.disableWebViewOptimizations();;
                      this.backgroundMode.isActive();
                        // console.log(respons['status_driver']);
                        if(respons['status_driver'] == 2){
                              // console.log('คนขับกำลังเคลื่อนที่');
                              // console.log(statustrack);
                            this.NotiStatus();
                            let datatrack ={
                              driver_id:statustrack['driver_id'],
                              vanid:statustrack['vanid'],
                              status:2
                            }
                            // let datatrack ={
                            //   driver_id:null,
                            //   vanid:null,
                            //   status:0
                            // }
                            this.storage.set('trackvan',datatrack)
                        }
                    })
                }else if(statustrack['status'] == 2){
                  let url = Enums.APIURL.URL + "/driver/location/driver="+statustrack.driver_id+ '&&license=' + statustrack.vanid;
                  this.http.get(url).map((res)=>res.json()).subscribe((driverposition)=>{
                   this.showlocation = driverposition;

                  // let directionsService = new google.maps.DirectionsService();
                  // let directionsRenderer = new google.maps.DirectionsRenderer();
                    this.storage.get('LocalPosition').then((position)=>{
                      //  directionsService.route({
                      //       origin: new google.maps.LatLng(position.lat,position.lng),
                      //       destination: new google.maps.LatLng(this.showlocation['latitude'],this.showlocation['longitude']),
                      //       optimizeWaypoints: true,
                      //       travelMode: google.maps.TravelMode.DRIVING
                      //   },
                        // (response, status) => {
                        //   if (status === "OK") {
                        //     directionsRenderer.setDirections(response);
                        //     let distansevalue = response.routes[0].legs[0].distance.value
                        //       if( distansevalue <= 1500){
                        //         this.NotiDiract();
                        //         let datatrack ={
                        //           driver_id:null,
                        //           vanid:null,
                        //           status:0
                        //         }
                        //         this.storage.set('trackvan',datatrack)
                        //       }
                        //   } else {
                        //     window.alert("Directions request failed due to " + status);
                        //   }
                        // }
                      // );

                      var R = 6373;
                      var lat1 = position.lat * Math.PI/180;
                      var lng1 = position.lng;

                      var lat2 = this.showlocation['latitude'] * Math.PI/180;
                      var lng2 = this.showlocation['longitude'];
                      var dLat = (lat2 - lat1) * Math.PI/180;
                       var dLon = (lng2 - lng1) * Math.PI/180;
                       var a = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon);
                       if (a > 1) {
                        a = 1;
                      }
                      a = Math.acos(a);
                      a = a * 180/Math.PI;
                       a = a * 60 * 1.1515;
                      let directionvalue = a * 1.609344;
                      let matix =  directionvalue.toFixed(1);
                      let km= 1.00;
                      if(directionvalue <= km){
                        // window.alert(directionvalue);
                        this.NotiDiract();
                                let datatrack ={
                                  driver_id:null,
                                  vanid:null,
                                  status:0
                                }
                        this.storage.set('trackvan',datatrack)
                      }
                    });
                  })
                }
            }
        })
    },3000);
  }

  NotiStatus(){
    this.localNotifications.schedule({
      title: 'การแจ้งเตือน',
      text: 'คนขับกำลังออกรถ'
    });
      // window.alert('คนขับกำลังออกรถ');
  }

  NotiDiract(){
    this.localNotifications.schedule({
      title: 'การแจ้งเตือน',
      text: 'รถอยู่ห่างจากคุณ 1 กิโลเมตร'
    });
    // window.alert('รถอยู่ห่างจากคุณ 1 กิโลเมตร');
  }


}//end

