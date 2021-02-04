import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { ModalController } from 'ionic-angular';
import { map } from 'rxjs/operator/map';
declare var google: any;
/**
/**
 * Generated class for the PoinPassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-poin-pass',
  templateUrl: 'poin-pass.html',
})
export class PoinPassPage {
  @ViewChild('map') mapElement: ElementRef;
infoWindow = new google.maps.InfoWindow();
  map: any;
  showrid:string;
  startlat:number;
  startlng:number;
  endlat:number;
  endlng:number;
  startname;
  endname;
  point:any;
  markerstart;
  markerend;
  markerpoint;
  image = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public http:Http,public alertCtrl: AlertController,public modalCtrl: ModalController,private geolocation: Geolocation,public platform: Platform) {
      this.initmap();
    // platform.ready().then(() => {
    //   this.initmap();
    // });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PoinPassPage');
  }

  ionViewWillEnter(){
    // console.log('ionViewWillLoad PoinPassPage');
    this.showrid = this.navParams.get('routeid');
    this.startname = this.navParams.get('startname');
    this.endname = this.navParams.get('endname');
    this.startlat = this.navParams.get('startlat');
    this.startlng = this.navParams.get('startlng');
    this.endlat = this.navParams.get('endlat');
    this.endlng = this.navParams.get('endlng');

  }


  initmap() {

    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom:12,
        center: {lat: resp.coords.latitude, lng:resp.coords.longitude},
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      this.markerstart = new google.maps.Marker({
        position: new google.maps.LatLng(this.startlat,this.startlng),
        map: this.map,
        icon: this.image,
        title:this.startname
    });

    this.markerend = new google.maps.Marker({
      position: new google.maps.LatLng(this.endlat,this.endlng),
      map: this.map,
      icon: this.image,
      title: this.endname
      });


      // google.maps.event.addListener(this.markerstart, "click", ((markerstart)=> {
      //     return function() {
      //       this.infoWindow.setContent(this.startname);
      //       this.infoWindow.open(this.map, markerstart);
      //     }
      // })(this.markerstart));
      this.markerstart.addListener('click',  ()=>{
        this.infoWindow.setContent(this.startname);
              this.infoWindow.open(this.map, this.markerstart)
      });

      this.markerend.addListener('click',  ()=>{
        this.infoWindow.setContent(this.endname);
              this.infoWindow.open(this.map, this.markerend)
      });


      let url = Enums.APIURL.URL+'/points/'+this.showrid;
     this.http.get(url).map(res=>res.json()).subscribe((data:any)=>{
        for(let i = 0; i < data.length; i++ ){
          this.markerpoint = new google.maps.Marker({
            position: new google.maps.LatLng(data[i]['po_latitude'], data[i]['po_longitude']),
            map: this.map,
            title: data[i]['po_name']
        });




        // this.markerpoint.addListener('click', ()=>{
        //   this.infoWindow.setContent(data[i]['po_name']);
        //    this.infoWindow.open(this.map, this.markerpoint)
        // });

        google.maps.event.addListener(this.markerpoint, 'click', ((marker,i,map,info)=>{
            return function() {
              info.setContent(data[i]['po_name']);
              info.open(map,marker);
            }
        })(this.markerpoint,i,this.map,this.infoWindow));
        }
  });



      directionsRenderer.setMap(this.map);
      this.calculateAndDisplayRoute(directionsService, directionsRenderer);
     }).catch((error) => {
       console.log('Error getting location', error);
     });

  }

 loadPoint(){
  //  console.log(this.point)
  let url = Enums.APIURL.URL+'/points/'+this.showrid;
  this.http.get(url).map(res=>res.json()).subscribe((data:any)=>{
    this.point = data;
    if(this.point!=null){
      let modal = this.modalCtrl.create('ModalPage',{data:this.point});
      modal.present();
      }else{
        let modal = this.modalCtrl.create('ModalPage',{data:"ไม่มีข้อมูล"});
      modal.present();
      }
  });

 }


 calculateAndDisplayRoute(directionsService, directionsRenderer){
  let url = Enums.APIURL.URL+'/points/'+this.showrid;
  this.http.get(url).map(res=>res.json()).subscribe((data:any)=>{
    this.point = data;
    // console.log(this.point);
    const waypts = [];
    for (let i = 0; i < this.point.length; i++) {
      if (this.point[i]['po_name']) {
          waypts.push({
              location: new google.maps.LatLng(this.point[i]['po_latitude'],this.point[i]['po_longitude']),
              stopover: true
          });
      }

  }
    directionsService.route(
      {
        origin:  new google.maps.LatLng(this.startlat,this.startlng),
        destination:new google.maps.LatLng(this.endlat,this.endlng),
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status ==="OK" ) {
          this.map = new google.maps.DirectionsRenderer({
            map: this.map,
            directions: response,
            suppressMarkers: true
          });
          // directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  });
}


}//end
