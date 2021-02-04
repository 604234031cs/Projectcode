import { TabsPage } from './../tabs/tabs';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map';
import { Md5 } from 'ts-md5/dist/md5';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit{
  inputlogin:FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage,public http: Http,
    public loadingCtrl: LoadingController,public alertCtrl:AlertController, public fb: FormBuilder) {
  }

  showloadding(){
    const loader = this.loadingCtrl.create({
      content: "กำลังโหลด....",
      duration: 500
    });
    loader.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter (){
      this.storage.get('accountdriver').then((val) => {
        if(val!=null && val['datavan'] !=null){
          this.showloadding();
          this.navCtrl.setRoot(TabsPage)
        }
        });
  }

  login(){
    console.log(Md5.hashStr(this.inputlogin.value.password));
    if(this.inputlogin.value.username !="" && this.inputlogin.value.password !=""){
      // console.log("username", this.inputlogin.value.username);
      // console.log("password",this.inputlogin.value.password);
      let url = Enums.APIURL.URL+'/driver/user='+this.inputlogin.value.username+'&&'+'pass='+ Md5.hashStr(this.inputlogin.value.password);
      this.http.get(url).map(res=>res.json()).subscribe((data:any={})=>{
        let account = {
          userid:data['d_id'],
          username:data['d_username'],
          password:data['d_password'],
          datavan:data['van_id']
        }
          if(data!=false){
             if(data['van_id']!=null || data['van_id']!=0 ){
                this.showloadding();
                 this.storage.ready().then(() => { //ถ้า platform พร้อมใช้งาน
                    this.storage.set('accountdriver', account)
                    });
                    this.navCtrl.setRoot(TabsPage);
              }
          }else if(data == false){
            let alert = this.alertCtrl.create({
              message: 'Username หรือ Password ไม่ถูกต้อง',
              buttons: [
                {
                  cssClass:'secondary',
                  text: 'OK',
                  role: 'OK',
                }
              ]
            });
            alert.present();
            this.inputlogin.value.username ="";
            this.inputlogin.value.password="";
          }
      });
    }else{
      let alert = this.alertCtrl.create({
        message: 'กรุณาใส่ Username และ Password',
        buttons: [
          {
            text: 'OK',
            role: 'OK',
            cssClass:'secondary'
          }
        ]
      });
      alert.present();
    }
  }

  ngOnInit(): any {
    this.buildForm();
  }

  buildForm(): void {
    this.inputlogin = new FormGroup({
      username: new FormControl("", [
        Validators.required
      ]),
      password: new FormControl("", [
        Validators.required
      ])
    });
  }


  ngAfterViewInit() {
    let tabs = document.querySelectorAll('.show-tabbar');
    if (tabs !== null) {
        Object.keys(tabs).map((key) => {
            tabs[key].style.display = 'none';
        });
    }
}

}//end
