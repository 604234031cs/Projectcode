import { PoinPassPage } from './../poin-pass/poin-pass';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
poins:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,private view:ViewController) {
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad ModalPage');
  // }
  ionViewWillLoad(){
    if(this.navParams.get('data')!=null){
      this.poins = this.navParams.get('data');
    }else{
        this.poins = null;
    }

    console.log(this.poins);

  }

  closeModal(){
    this.view.dismiss();
  }
}
