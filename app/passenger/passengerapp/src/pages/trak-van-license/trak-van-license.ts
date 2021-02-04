import { Http } from '@angular/http';
import { ProfileDriverPage } from './../profile-driver/profile-driver';
import { Component,ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map'
// declare var google: any;
// declare var longdo: any;
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-trak-van-license',
  templateUrl: 'trak-van-license.html',
})
export class TrakVanLicensePage{
  @ViewChild('map') mapElement: ElementRef;
locationvan:any={};
map:any;
lat = 0;
lng = 0;
markers =[];
 info:any;
 showlocation:any=[];
 interval:any;
 infowindow:any;
 iconmarker = "assets/imgs/iconmarker.png";
  constructor(public navCtrl: NavController, public navParams: NavParams,public platform: Platform,public http:Http,private geolocation: Geolocation) {

    this.locationvan =this.navParams.data;

    platform.ready().then(() => {
      this.initmap();
    });
  }


initmap(){
  // this.map = new longdo.Map({
  //   placeholder: document.getElementById('map')

  // });

  // this.geolocation.getCurrentPosition().then(pos => {

  //   let mapOptions = {
  //     center: pos.coords.latitude,
  //     zoom: 15,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   }

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom:15,
      center: {lat: 41.85, lng: -87.65},
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

  // });

}


addMarker(lat,lng){
  let marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat,lng),
    map:this.map,
    icon:this.iconmarker
  });
  this.markers.push(marker);
  this.map.setCenter(new google.maps.LatLng(lat,lng));
}

  OpenProfileDriver(){
  let url = Enums.APIURL.URL+ '/driver/data/driver='+ this.locationvan['d_id'];
  this.http.get(url).map(res=>res.json()).subscribe((data:any)=>{
    this.navCtrl.push(ProfileDriverPage,data);
    // console.log(data);
  });
  }

  ionViewDidEnter(){
    this.interval=setInterval(()=>{
      this.deleteMarkers();
    let url = Enums.APIURL.URL + "/driver/location/driver="+this.locationvan['d_id'] + '&&license=' + this.locationvan['van_license'];
     this.http.get(url).map((res)=>res.json()).subscribe((position:any)=>{
      // console.log('Postion');
      this.showlocation = position;
      console.log(position);
       this.addMarker(position['latitude'],position['longitude']);
     })
      },3000);
  }

  ionViewDidLeave(){
    clearInterval(this.interval);
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
    console.log(this.markers);

  }
}//end

