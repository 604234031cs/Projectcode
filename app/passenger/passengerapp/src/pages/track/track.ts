import { LicensePage } from './../license/license';
import { LoginPage } from './../login/login';
import { RoutePage } from './../route/route';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
/**
 * Generated class for the TrackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-track',
  templateUrl: 'track.html',
})
export class TrackPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage,public alertCtrl: AlertController,public loadingCtrl: LoadingController) {
  }


  showloadding(){
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 500
    });
    loader.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrackPage');
  }
//  goHome(){
//    this.showloadding();
//    this.navCtrl.push(HomePage);
//  }

 pageRoute(){
   this.showloadding();
   this.navCtrl.push(RoutePage);
 }

 Logout(){
  const confirm = this.alertCtrl.create({
    title: 'คุณต้องการออกจากระบบหรือไม่?',
    buttons: [
      {
        text: 'ตกลง',
        handler: () => {
          this.storage.remove('accoutuser');
          this.navCtrl.setRoot(LoginPage);
        }
      },
      {
        text: 'ยกเลิก',
        handler: () => {

        }
      }
    ]
  });
  confirm.present();
}

pageLicense(){
  this.showloadding();
  this.navCtrl.push(LicensePage);
}


}
