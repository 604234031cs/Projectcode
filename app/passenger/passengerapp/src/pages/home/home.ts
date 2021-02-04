import { Http } from '@angular/http';
import { LoginPage } from './../login/login';
import { AccountPage } from './../account/account';
import { TrackPage } from './../track/track';
import { Component,ViewChild,ElementRef} from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map';
declare var google: any;
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  showlocation:any=[];
  lat = 0;
lng = 0;
map:any;
interval:any;
markers =[];
 infowindow:any;
iconmarker = "assets/imgs/iconmarker.png";
  constructor(public navCtrl: NavController,private storage: Storage,public platform: Platform,public http:Http,private geolocation: Geolocation) {
    platform.ready().then(() => {
      this.initmap();

    });
  }

  initmap(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: {lat: resp.coords.latitude, lng: resp.coords.longitude},
        zoom:15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
     }).catch((error) => {
       console.log('Error getting location', error);
     });

}


ionViewDidEnter(){
  this.storage.get('trackvan').then((data)=>{
    this.interval=setInterval(()=>{
      this.deleteMarkers();
    let url = Enums.APIURL.URL + "/driver/location/driver="+data['driver_id']+ '&&license=' + data['vanid'];
     this.http.get(url).map((res)=>res.json()).subscribe((position)=>{
      this.showlocation = position;
      console.log(position);
       this.addMarker(position['latitude'],position['longitude']);
     })
      },3000);
  })
}
ionViewDidLeave(){
  clearInterval(this.interval);
}
addMarker(lat,lng){
  let marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat,lng),
    map:this.map
    // icon:this.iconmarker
  });
  this.markers.push(marker);
  this.map.setCenter(new google.maps.LatLng(lat,lng));
}
setMapOnAll(map) {
  for (let i = 0; i < this.markers.length; i++) {
    this.markers[i].setMap(map);
  }
}
clearMarkers() {
  this.setMapOnAll(null);
}
deleteMarkers() {
  this.clearMarkers();
  this.markers = [];
  // console.log(this.markers);
}



}//end
