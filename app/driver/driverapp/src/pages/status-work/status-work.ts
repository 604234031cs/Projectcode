import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-status-work',
  templateUrl: 'status-work.html',
})
export class StatusWorkPage {
  update:boolean;
  getAccount:any={};
  statusupdate;
  text;
  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage,public http: Http,public toastCtrl: ToastController,public loadingCtrl: LoadingController) {
  }


  showloading(){
    const loader = this.loadingCtrl.create({
      content: "กำลังโหลด ...",
      duration: 500
    });
    loader.present();
  }
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad StatusWorkPage');
  // }

  ionViewWillEnter(){
    this.showloading();
    this.loadAccount();
  }

  loadAccount(){
    this.storage.get('accountdriver').then((val) => {
     let getlocadata = val
      let url = Enums.APIURL.URL+'/accountdriver/'+ getlocadata['userid'];
      this.http.get(url).map(res=>res.json()).subscribe((resdata:any)=>{
          this.getAccount =resdata;
          console.log(this.getAccount);
          if(this.getAccount['status_driver'] =='0'){
            this.update = false;
          }else if(this.getAccount['status_driver'] =='1' || this.getAccount['status_driver'] =='2'){
            this.update = true;
              if(this.getAccount['status_driver'] =='1'){
                  this.text = "เตรียมเดินทาง"
              }else if(this.getAccount['status_driver'] =='2'){
                   this.text = "กำลังเดินทาง"
              }
          }
      });
  });
  }

  updatestatus(){
    let updatevalue;
    if(this.update == false){
      // console.log("สถานคือ "+updatevalue);
     updatevalue ="0"
      // console.log("สถานคือ "+updatevalue);
      //       console.log(this.statusvalue);
    // console.log(this.getAccount['d_id']);

            let url = Enums.APIURL.URL+'/updatestatusdriver/'+ this.getAccount['d_id']+'&&'+updatevalue;
            this.http.get(url).map(res=>res.json()).subscribe((res:any)=>{
              // console.log(res);
              if(res=="Success"){
                const toast = this.toastCtrl.create({
                  message: 'อัพเดทสถานะเรียบร้ย',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();
              }else{
                const toast = this.toastCtrl.create({
                  message: 'เกิดข้อผิดพลาด',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();
              }
            });

    }else if(this.update==true){
      updatevalue ="1"
      // console.log("สถานคือ "+updatevalue);
     let numberstatus = this.statusupdate
      let url = Enums.APIURL.URL+'/updatestatusdriver/'+ this.getAccount['d_id']+'&&'+numberstatus;
      this.http.get(url).map(res=>res.json()).subscribe((res:any)=>{
        // console.log(res);
        if(res=="Success"){
          const toast = this.toastCtrl.create({
            message: 'อัพเดทสถานะเรียบร้ย',
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
    }
  }



}
