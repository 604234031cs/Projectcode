import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UpdatePage } from '../update/update';
import { AccountPage } from '../account/account';

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

  updateRoot = UpdatePage
  accountRoot = AccountPage


  constructor(public navCtrl: NavController) {

  }








}
