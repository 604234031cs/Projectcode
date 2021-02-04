import { MapsPage } from './../maps/maps';
import { Http } from '@angular/http';
import { Component,ViewChild,ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform,Refresher} from 'ionic-angular';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
// declare var google: any;
/**
 * Generated class for the ListDriverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-driver',
  templateUrl: 'list-driver.html',
})
export class ListDriverPage {
  routeid;
  driverlist:any;
  statustrack:boolean=false;
  numstatus;
  startus;
  arry = []
  check;
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public platform: Platform,private storage: Storage,private callNumber: CallNumber) {
    platform.ready().then(() => {

    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ListDriverPage');
    // console.log(this.routeid);
  }
  ionViewDidEnter(){
    this.routeid = this.navParams.data;
    this.LoadDriverList();
    this.storage.get('trackvan').then((checktrak)=>{
        console.log(checktrak);
      this.check = checktrak;
    })
  }

  LoadDriverList(){
    let url = Enums.APIURL.URL+'/driverlist/' + this.routeid;
    this.http.get(url).map(res=>res.json()).subscribe((respon)=>{
        // console.log(respon[0].latitude);
      this.driverlist = respon;
      this.arry =[];
      console.log('ก่อนเรียง');
      console.log(respon);

      // this.MatrixDistance(this.driverlist);
      this.CaculatDirections(this.driverlist);
    });
  }

 openLocation(did,vanid){
      this.navCtrl.push(MapsPage,{
        d_id:did,
        vanid:vanid
      })
 }


CaculatDirections(listdriver){
   this.storage.get('LocalPosition').then((position)=>{
    //  let lat1 = 18.741318 * Math.PI/180; ;
    //  let lng1 = 98.943172 ;
    //  let lat2 = 18.741928 * Math.PI/180; ;
    //  let lng2 = 98.941476;
      //  console.log('ตำแหน่งที่'+position.lat);
          // var R = 6373; // km
          // var dLat = (lat2 - lat1)* Math.PI/180;
          // var dLon = (lng2 - lng1)* Math.PI/180;
          // var a = (Math.sin(dLat/2)*Math.sin(dLat/2)) + Math.cos(lat1) * Math.cos(lat2) * (Math.sin(dLon/2)*Math.sin(dLon/2));
          // var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          // var d = R  * c;

          // console.log("ระยะทางได้ผลลัพธ์ = " + d.toFixed(2) + "km");
      //  console.log('ตำแหน่ง'+  position.lng);
      for(let i =0;i<listdriver.length;i++){
      //     // console.log(listdriver[i].longitude);
          var R = 6373; // km
          var lat1 = position.lat * Math.PI/180; //1
          var lng1 = position.lng;  //2
          var lat2= listdriver[i].latitude * Math.PI/180;
          var lng2 = listdriver[i].longitude;
          var dLat = (lat2 - lat1) * Math.PI/180;
          var dLon = (lng2 - lng1) * Math.PI/180;
          // var a = Math.pow(Math.sin(dLat/2),2) + Math.pow(Math.sin(dLon/2),2)* Math.cos(lat1) * Math.cos(lat2);
          var a = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon);
          if (a > 1) {
		        	a = 1;
		        }
              a = Math.acos(a);
              a = a * 180/Math.PI;
              a = a * 60 * 1.1515;
             var valuedirec = a * 1.609344
             var directions = valuedirec.toFixed(1);
          // var c =  2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));s
          // var d = R  * c;
          // console.log("1ระยะทางได้ผลลัพธ์ = " + valuedirec);
           this.arry.push({
              d_id:listdriver[i]['d_id'],
              d_name:listdriver[i]['d_name'],
              d_lastname:listdriver[i]['d_lastname'],
              sex:listdriver[i]['sex'],
              phone:listdriver[i]['phone'],
              d_img:listdriver[i]['d_img'],
              status_driver:listdriver[i]['status_driver'],
              van_license:listdriver[i]['van_license'],
              number_passenger:listdriver[i]['number_passenger'],
              directions:directions + ' ' +'กม.',
              valuedirec:valuedirec
            });

      }

      // console.log(this.arry);
      let temp;
      let j:number;
      let k:number;
      // console.log(this.arry.length);
        for( k=0; k < this.arry.length-1; k++){
          // console.log(k);

            for( j = 0 ; j < this.arry.length-1; j++){
              // console.log(j);
              let index = j + 1;
              // console.log(this.arry[index]['valuedirec']);

               if(this.arry[j]['valuedirec'] > this.arry[j+1]['valuedirec']){
                temp =this.arry[j];
                this.arry[j]=this.arry[j+1];
             this.arry[j+1]=temp;
            }

            // console.log(this.arry[j]['directionscaculat']);

       }
    }
    console.log('หลังเรียง');
    console.log(this.arry);
   });
}


//  MatrixDistance(listdriver){

//   let directionsService = new google.maps.DirectionsService();
//   let directionsRenderer = new google.maps.DirectionsRenderer();
//     this.storage.get('LocalPosition').then((position)=>{
//     // let origin = new google.maps.LatLng(position.lat,position.lng);
//     //           console.log(listdriver[0].latitude);
//     //     //   console.log(element.longitude)
//     // let destination = new google.maps.LatLng(listdriver[0]['latitude'],listdriver[0]['longitude']);
//       for(let i =0;i<listdriver.length;i++){
//           if(listdriver[i]['d_id']){
//        directionsService.route({
//             origin: new google.maps.LatLng(position.lat,position.lng),
//             destination: new google.maps.LatLng(listdriver[i]['latitude'],listdriver[i]['longitude']),
//             optimizeWaypoints: true,
//             travelMode: google.maps.TravelMode.DRIVING
//         },
//         (response, status) => {
//           if (status === "OK") {

//             directionsRenderer.setDirections(response);
//                // console.log(direcvalue);
//  console.log("Googleระยะทางได้ผลลัพธ์ = " + response.routes[0].legs[0].distance.text);
//             // console.log(response.routes[0].legs[0].distance.text);
//             // console.log(response);
//         //     this.arry.push({
//         //       d_id:listdriver[i]['d_id'],
//         //       d_name:listdriver[i]['d_name'],
//         //       d_lastname:listdriver[i]['d_lastname'],
//         //       sex:listdriver[i]['sex'],
//         //       phone:listdriver[i]['phone'],
//         //       d_img:listdriver[i]['d_img'],
//         //       status_driver:listdriver[i]['status_driver'],
//         //       van_license:listdriver[i]['van_license'],
//         //       number_passenger:listdriver[i]['number_passenger'],
//         //       directions:response.routes[0].legs[0].distance.text,
//         //       directionsvalue:response.routes[0].legs[0].distance.value
//         //     });

//         // this.sortArray(this.arry);

//           } else {
//             window.alert("Directions request failed due to " + status);
//           }
//         }
//       );

//           }//endif


//       }

//     });
//  }

// sortArray(arry){
//     console.log(arry);

// }
cancelTrackDriver(){
  let datatrack = {
    driver_id : null,
    vanid:null,
    status:0
  }
  this.storage.set('trackvan',datatrack);
  // console.log(datatrack);
  setTimeout(() => {

    this.ionViewDidEnter();

    }, 1000);
}


TrackDriver(did,vanid){
  this.startus = 1
  let datatrack = {
    driver_id : did,
    vanid:vanid,
    status:this.startus
  }
  this.storage.set('trackvan',datatrack);
  // console.log(datatrack);
  setTimeout(() => {
    this.ionViewDidEnter();

  }, 1000);
}

doRefresh(refresher: Refresher) {
  setTimeout(() => {
  this.arry =[];
  this.LoadDriverList();
  refresher.complete();
  }, 2000);
}


call(numberphone){
  this.callNumber.callNumber(numberphone, true).then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));

}


zoomimg(){
  console.log("55");

}
}
