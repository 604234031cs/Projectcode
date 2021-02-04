import { ListDriverPage } from './../list-driver/list-driver';
import { PoinPassPage } from './../poin-pass/poin-pass';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
/**
 * Generated class for the RoutePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-route',
  templateUrl: 'route.html',
})
export class RoutePage {
  routes:any=[]
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public loadingCtrl: LoadingController) {
    this.loadRoute();
  }

  showloadding(){
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 500
    });
    loader.present();
  }

  // ionViewDidLoad() {

  // }

  getItems(ev: any){
    let val = ev.target.value;
    if (val && val.trim() != ''){
      let url = Enums.APIURL.URL+'/search/routes/'+val;
      this.http.get(url).map(res=>res.json()).subscribe((data:any)=>{
        this.routes = data;
      });
    }else{
        this.loadRoute();
    }
}

loadRoute(){
  let url = Enums.APIURL.URL+'/routes';
  this.http.get(url).map(res=>res.json()).subscribe((data:any)=>{
    // console.log(data);
    this.routes = data;
  });
}


viewpoint(routeId,startname,endname,startlat,startlng,endlat,endlng){
  this.showloadding();
  this.navCtrl.push(PoinPassPage,{
    routeid:routeId,
    startname:startname,
    endname:endname,
    startlat:startlat,
    startlng:startlng,
    endlat:endlat,
    endlng:endlng
  })
}

showlistdriver(routeId){
  this.showloadding()
  this.navCtrl.push(ListDriverPage,routeId);
}
}
