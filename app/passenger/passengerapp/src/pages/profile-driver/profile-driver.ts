import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProfileDriverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-driver',
  templateUrl: 'profile-driver.html',
})
export class ProfileDriverPage {
  dataDriver:any={};
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.dataDriver =this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileDriverPage');
    console.log(this.dataDriver);

  }

  loadProfile(){
      console.log(this.dataDriver.d_id);
  }



}
