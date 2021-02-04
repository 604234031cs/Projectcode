import { Http } from '@angular/http';
import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map'
declare var google: any;
/**

/**
 * Generated class for the MapsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage {
  @ViewChild('map') mapElement: ElementRef;
  iddriver;
  vanid;
  startus;
  showlocation:any=[];
  lat = 0;
lng = 0;
map:any;
interval:any;
markers =[];
 infowindow:any;
iconmarker = "assets/imgs/iconmarker.png";
  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage,public platform: Platform,public http:Http) {
    this.iddriver=this.navParams.get('d_id');
     this.vanid=this.navParams.get('vanid');
     platform.ready().then(() => {
      this.initmap();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapsPage');

  }

  initmap(){
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: {lat: 41.85, lng: -87.65},
      zoom:15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
}

  TrackDriver(){
    this.startus = 1
    let datatrack = {
      driver_id : this.iddriver,
      status:this.startus
    }
    this.storage.set('trackvan',datatrack);
  }


  ionViewDidEnter(){
    this.interval=setInterval(()=>{
      this.deleteMarkers();
      // console.log(this.iddriver);
      // console.log(this.vanid);
    let url = Enums.APIURL.URL + "/driver/location/driver="+this.iddriver+ '&&license=' + this.vanid;
     this.http.get(url).map((res)=>res.json()).subscribe((position)=>{

      this.showlocation = position;
      console.log(position);
       this.addMarker(position['latitude'],position['longitude']);
     })
      },3000);
  }


  addMarker(lat,lng){
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat,lng),
      map:this.map,
      // icon:this.iconmarker
    });
    this.markers.push(marker);
    this.map.setCenter(new google.maps.LatLng(lat,lng));
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

}
