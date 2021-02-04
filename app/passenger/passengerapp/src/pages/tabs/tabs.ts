import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TrackPage } from '../track/track';
import { AccountPage } from '../account/account';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the TabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  trackRoot = TrackPage
  accountRoot = AccountPage
  homeRoot  = HomePage
  interval;
  tracknum;

  constructor(public navCtrl: NavController, private storage: Storage) {}



  ionViewWillEnter(){
    this.interval=setInterval(()=>{

      this.storage.get('trackvan').then((track:any)=>{
        if(track['driver_id'] != null){
          this.tracknum = 1;
        }else{
          this.tracknum = null;
        }


      })

    },1000)
  }
}
