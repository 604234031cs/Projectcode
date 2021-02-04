import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';
import { Storage } from '@ionic/storage';
import { Http, RequestOptions } from '@angular/http';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';
import { ActionSheetController } from 'ionic-angular';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
accountuser:any=[];
updateResult:any={};
userid:any;
change:any;
edit:Boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,public popoverCtrl:PopoverController,
    private storage: Storage,public http:Http,public loadingCtrl: LoadingController,public actionSheetCtrl: ActionSheetController) {
      this.updateResult.name = "";
      this.updateResult.lastname = "";
      this.updateResult.email = "";
      this.updateResult.phone = "";
  }

  ionViewWillLoad() {
   this.storage.get('accoutuser').then(p=>{
        if(p == null){
          this.navCtrl.setRoot(LoginPage);
        }else{
          this.loadaccount();
        }
   });

  }


  OpenOption(){
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'เปลี่ยนรหัสผ่าน',
          role: 'destructive',
          icon: 'key',
          handler: () => {
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
        },{
          text: 'ออกจากระบบ',
          icon: 'power',
          handler: () => {
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
        },{
          text: 'Cancel',
          role: 'cancel',
          icon:'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  loadaccount(){
    this.storage.get('accoutuser').then((val) => {
      // console.log(val['p_name']);
      this.updateResult.id = val['userid'];
      this.accountuser = val;
      this.change = val;
      // console.log(this.accountuser['userid']);
      // console.log(this.accountuser['username']);
      // this.updateResult.lastname = val['p_password'];
      let url = Enums.APIURL.URL+'/account/'+ this.updateResult.id;
      this.http.get(url).map(res=>res.json()).subscribe((data:any={})=>{
        // console.log(data);
        this.updateResult.name = data['p_name'];
        this.updateResult.lastname = data['p_lastname'];
        this.updateResult.email = data['p_email'];
        this.updateResult.phone = data['phone'];
      });
    });
  }

  editAccount(){
    if(this.updateResult.name != "" && this.updateResult.lastname != "" && this.updateResult.email != "" && this.updateResult.phone !=""){
      console.log(this.accountuser['userid']);
        // console.log(this.updateResult.name);
        // console.log(this.updateResult.lastname);
        // console.log(this.updateResult.email);
        // console.log(this.updateResult.phone);
        const confirm = this.alertCtrl.create({
          title: 'ยืนยันการอัพเดทข้อมูล',
          message: 'กดปุ่มยืนยันเพื่อทำการแก้ไขข้อมูล',
          buttons: [
            {
              text:'ยืนยัน',
              handler: () => {
                let url = Enums.APIURL.URL+'/accountpassenger/'+ this.accountuser['userid']+"&&"+this.updateResult.name+"&&"+ this.updateResult.lastname+"&&"+this.updateResult.phone;
                this.http.get(url).map(res=> res.json()).subscribe(respon=>{
                if(respon=="Success"){
                const alert = this.alertCtrl.create({
                            title: 'สำเร็จ',
                            subTitle:'อัพเดทข้อมูลเรียบร้อย',
                            buttons: [
                              {
                              text: 'ตกลง',
                              handler:()=>{
                                const loader = this.loadingCtrl.create({
                                  content: "Please wait...",
                                  duration: 3000
                                });
                                loader.present();
                                this.edit = false;
                                this.doRefresh();
                              }
                            }
                          ]
                          });
                          alert.present();
                }else if(respon == "Error"){
                  const alert = this.alertCtrl.create({
                    title: 'เกิดข้อผิดพลาด',
                    buttons: ['OK']
                  });
                  alert.present();
                  console.log(respon);
                }
                });
              }
            },
            {
              text:'ยกเลิก',
              handler: () => {
              }
            }
          ]
        });
        confirm.present();
  }
}
ionViewDidLeave(){
  this.edit = false
  this.doRefresh();
} 

doRefresh() {
  setTimeout(() => {
    this.ionViewWillLoad();
  }, 500);
}

}
