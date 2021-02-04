import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map';
import { Md5 } from 'ts-md5/dist/md5';
/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  value:any={};
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,public http:Http) {
    this.value.phonenumber="";
    this.value.newpassword="";


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }




  Changepass(){
      if( this.value.phonenumber!="" &&  this.value.newpassword!=""){
          // console.log( this.value.phonenumber);
          // console.log(this.value.newpassword);
        let url = Enums.APIURL.URL+'/changepass/phonenumber='+this.value.phonenumber+'&&newpassword='+ Md5.hashStr(this.value.newpassword);
        this.http.get(url).map((res)=>res.json()).subscribe((respons)=>{

            if(respons.status ==200){
              const alert = this.alertCtrl.create({
                title: 'สำเร็จ',
                subTitle: 'เปลี่ยนรหัสผ่านเรียบร้อย',
                buttons: ['OK']
              });
              alert.present();

            }else if(respons.status ==404){
              const alert = this.alertCtrl.create({
                title: 'เกิดข้อผิดพลาด!',
                subTitle: 'ข้อมูลไม่ถูกต้อง',
                buttons: ['OK']
              });
              alert.present();
            }


        });

      }else{
        const alert = this.alertCtrl.create({
          title: 'เกิดข้อผิดพลาด!',
          subTitle: 'กรุณากรอข้อมูลให้ครบ',
          buttons: ['OK']
        });
        alert.present();
      }

  }

}
