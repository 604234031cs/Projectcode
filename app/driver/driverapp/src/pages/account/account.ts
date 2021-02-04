import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { AlertController,PopoverController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';
import { ActionSheetController } from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';
import { LoadingController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  accountuser:any=[];
  updateResult:any={};
  userid:any;
  edit:Boolean = false;
  change:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,public http: Http,
    public actionSheetCtrl: ActionSheetController,public popoverCtrl: PopoverController,public alertCtrl: AlertController,public loadingCtrl: LoadingController) {
  }

  showloading(){
    const loader = this.loadingCtrl.create({
      content: "กำลังโหลด...",
      duration: 500
    });
    loader.present();
  }

  ionViewWillLoad() {
    this.storage.get('accountdriver').then((val) => {
      if(val ==null){
        this.navCtrl.setRoot(LoginPage);
      }else{
        // this.showloading();
        this.loadaccount();
      }
    });

  }


  OpenOption(){
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'เปลี่ยนรหัสผ่าน',
          icon:'key',
          role: 'destructive',
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
                    console.log(data['newpassword']);
                    // console.log(this.change);

                    if(data['password'] !='' && data['newpassword'] !=''){
                      if(Md5.hashStr(data['password']) == this.change['password']){
                          let newAccount = {
                              userid:this.change['userid'],
                              username:this.change['username'],
                              password:Md5.hashStr(data['newpassword']),
                              datavan:this.change['datavan']
                          };

                        let url = Enums.APIURL.URL+'/driverpassword/'+this.change['userid']+'&&'+this.change['password']+'&&'+Md5.hashStr(data['newpassword']);
                        this.http.get(url).map(res=>res.json()).subscribe((response:any)=>{

                              if(response == 'Success'){
                                this.showloading();
                                const alert = this.alertCtrl.create({
                                    title: 'สำเร็จ',
                                    subTitle: 'เปลี่ยนรหัสผ่านเรียบร้อย',
                                    cssClass:'my-custom-class',
                                    buttons: ['OK']
                                  });
                                  alert.present();
                                  this.storage.set('accountdriver',newAccount);
                              }else if(response == 'Error'){
                                this.showloading();
                                const alert = this.alertCtrl.create({
                                  title: 'เกิดข้อผิดพลาด',
                                  subTitle: 'ไม่สามารถเปลี่ยนรหัสผ่านได้',
                                  cssClass:'my-custom-class',
                                  buttons: ['OK']
                                });
                                alert.present();
                              }

                        });

                        // console.log("Pass");

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
            console.log('Logout');
            const confirm = this.alertCtrl.create({
              title: 'คุณต้องการออกจากระบบหรือไม่ ?',
              buttons: [
                {
                  text: 'ตกลง',
                  handler: () => {
                    this.showloading();
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

  ionViewDidLeave(){
    this.edit = false
    this.doRefresh();
  }

  loadaccount(){
    this.storage.get('accountdriver').then((val) => {
      // console.log(val['p_name']);
      this.updateResult.id = val['userid'];
      this.change= val;
      // console.log(this.updateResult.id);
      this.accountuser = val;
      console.log(this.accountuser['van_license']);
      // console.log(this.accountuser['username']);
      // this.updateResult.lastname = val['p_password'];

      let url = Enums.APIURL.URL+'/accountdriver/'+ this.updateResult.id;
      this.http.get(url).map(res=>res.json()).subscribe((data:any={})=>{
        console.log(data);
        this.updateResult =data;
        this.updateResult.name = data['d_name'];
        this.updateResult.lastname = data['d_lastname'];
        this.updateResult.sex = data['sex'];
        this.updateResult.phone = data['phone'];

      });
    });
  }

  doRefresh() {
    setTimeout(() => {
      this.ionViewWillLoad();
    }, 500);
  }

}
