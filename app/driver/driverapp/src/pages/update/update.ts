import { Http } from '@angular/http';
import { LoginPage } from './../login/login';
import { StatusWorkPage } from './../status-work/status-work';
import { Component,ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the UpdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update',
  templateUrl: 'update.html',
})
export class UpdatePage {
  update:boolean;
  getAccount:any={};
  getLocation:any=[];
  watch: any;
  lat: number = 0;
  lng: number = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,private storage: Storage,public http: Http,
    public actionSheetCtrl: ActionSheetController,private toastCtrl: ToastController

    ) {
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdatePage');
  }

  updatework(){
    this.navCtrl.push(StatusWorkPage)
  }
  ionViewWillEnter(){
    this.loadaccount();
  }

  // LocationUpdate(lat,lng,license){
  //   let url = Enums.APIURL.URL+'/locationupdate/lat='+lat+'&&lng='+lng+'&&license='+license;
  //   this.http.get(url).map((res)=>res.json()).subscribe((res:any)=>{
  //       console.log(res);
  //   });
  // }

  loadaccount(){
    this.storage.get('accountdriver').then((val) => {
      let getlocadata = val
       let url = Enums.APIURL.URL+'/accountdriver/'+ getlocadata['userid'];
       this.http.get(url).map(res=>res.json()).subscribe((resdata:any)=>{
           this.getAccount =resdata;
           console.log('หน้าแรก');

           console.log(this.getAccount);

           if(this.getAccount['status_driver'] =='0'){
             this.update = false;
           }else if(this.getAccount['status_driver'] =='1'){
             this.update = true;
           }
       });
   });
  }


  updatepassenger(){
    const actionSheet = this.actionSheetCtrl.create({
      title: 'อัพเดทจำนวนผู้โดยสาร',
      buttons: [
        {
          text: 'เต็ม',
          role: 'destructive',
          handler: () => {
            let stupassenger = '1'
            // console.log(this.getAccount['van_id']);
            let url = Enums.APIURL.URL+'/updatepassenger/'+ this.getAccount['van_id']+'&&'+stupassenger;
            this.http.get(url).map(res=>res.json()).subscribe((res:any)=>{
              // console.log(res);
              if(res=="Success"){
                const toast = this.toastCtrl.create({
                  message: 'อัพเดทสถานะเรียบร้อย',
                  duration: 3000,
                  position: 'top',
                  cssClass:'tostcss'
                });
                toast.present();
              }else{
                const toast = this.toastCtrl.create({
                  message: 'เกิดข้อผิดพลาด',
                  duration: 3000,
                  position: 'top',
                  cssClass:'tostcss'
                });
               setTimeout(()=>{
                  this.loadaccount();
               },1000)
                toast.present();

              }
            });
            setTimeout(()=>{
              this.loadaccount();
           },1000)
          }
        },{
          text: 'ว่าง',
          handler: () => {
            let stupassenger = '0'
            // console.log(stupassenger);
            let url = Enums.APIURL.URL+'/updatepassenger/'+ this.getAccount['van_id']+'&&'+stupassenger;
            this.http.get(url).map(res=>res.json()).subscribe((res:any)=>{
              // console.log(res);
              if(res=="Success"){
                const toast = this.toastCtrl.create({
                  message: 'อัพเดทสถานะเรียบร้อย',
                  duration: 3000,
                  position: 'top',
                  cssClass:'tostcss'
                });
                toast.present();
              }else{
                const toast = this.toastCtrl.create({
                  message: 'เกิดข้อผิดพลาด',
                  duration: 3000,
                  position: 'top',
                  cssClass:'tostcss'
                });

                toast.present();

              }
            });
            setTimeout(()=>{
              this.loadaccount();
           },1000)
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  Logout(){
    const confirm = this.alertCtrl.create({
      title: 'คุณต้องการออกจากระบบหรือไม่ ?',
      buttons: [
        {
          text: 'ตกลง',
          handler: () => {
            this.storage.remove('accountdriver');

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



}//end
