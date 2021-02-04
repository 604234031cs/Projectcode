import { LoginPage } from './../../pages/login/login';
import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { AlertController, ViewController, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map';
import { Md5 } from 'ts-md5/dist/md5';
/**
 * Generated class for the PopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  change:any;
  constructor(public navCtrl: NavController,public alertCtrl: AlertController,public viewCtrl:ViewController,private storage: Storage,public http:Http) {
    console.log('Hello PopoverComponent Component');
  }


  ionViewWillLoad() {
    this.storage.get('accoutuser').then((val)=>{
      this.change = val;
    });
  }

  ChangePassword(){
    const prompt = this.alertCtrl.create({
      title: 'เปลี่ยนรหัสผ่าน',
      inputs: [
        {
          name: 'password',
          placeholder: 'ใส่รหัสผ่านปัจจุบัน',
          type:'password'
        },
        {
          name:'newpassword',
          placeholder: 'ใส่รหัสผ่านใหม่',
          type:'password'
        }
      ],

      buttons: [
        {
          text: 'ยืนยัน',
          handler: data => {
            console.log(data['password']);
            // console.log(data['newpassword']);
            if(data['password'] !='' && data['newpassword'] !=''){

              if(Md5.hashStr(data['password']) == this.change['password']){
                  let newAccount = {
                      userid:this.change['userid'],
                      username:this.change['username'],
                      password:Md5.hashStr(data['newpassword'])
                  };

                let url = Enums.APIURL.URL+'/passengerpassword/'+this.change['userid']+'&&'+this.change['password']+'&&'+Md5.hashStr(data['newpassword']);
                this.http.get(url).map(res=>res.json()).subscribe((response:any)=>{
                      // console.log(response);
                      if(response == 'Success'){
                        const alert = this.alertCtrl.create({
                            title: 'สำเร็จ',
                            subTitle: 'เปลี่ยนรหัสผ่านเรียบร้อย',
                            cssClass:'my-custom-class',
                            buttons: ['OK']
                          });
                          alert.present();
                          this.storage.set('accoutuser',newAccount);
                      }else if(response == 'Error'){
                        const alert = this.alertCtrl.create({
                          title: 'เกิดข้อผิดพลาด',
                          subTitle: 'ไม่สามารถเปลี่ยนรหัสผ่านได้',
                          cssClass:'my-custom-class',
                          buttons: ['OK']
                        });
                        alert.present();
                      }

                });

                console.log("Pass");
                //
            }else if(data['password'] != this.change['password']){
              // console.log("Fail");
              const alert = this.alertCtrl.create({
                title: 'เกิดข้อผิดพลาด',
                subTitle: 'กรุณาใส่รหัสผ่านให้ถูกต้อง',
                buttons: ['OK']
              });
              alert.present();
            }
          }else{
            const alert = this.alertCtrl.create({
              title: 'เกิดข้อผิดพลาด',
              subTitle: 'กรุณาใส่ข้อมูล',
              buttons: ['OK']
            });
            alert.present();
          }
          }
        },
        {
          text: 'ยกเลิก',
          handler: data => {

          }
        }
      ]
    });
    prompt.present();
  }



  Logout(){
    const confirm = this.alertCtrl.create({
      title: 'คุณต้องการออกจากระบบหรือไม่ ?',
      buttons: [
        {
          text: 'ตกลง',
          handler: () => {
            this.viewCtrl.dismiss();
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

}
