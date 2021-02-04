import { ForgotPasswordPage } from './../forgot-password/forgot-password';
import { FormGroup,FormControl,Validators} from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { RegisPage } from '../regis/regis';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { Md5 } from 'ts-md5/dist/md5';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  inputlogin:FormGroup;
  username:any;
  type;
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public alertCtrl:AlertController,
    public loadingCtrl: LoadingController,private storage: Storage ) {
    // this.inputlogin.username ="";
    // this.inputlogin.password="";
  }
  ionViewWillEnter (){
      this.storage.get('accoutuser').then((val) => {
        if(val!=null){
          const loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 500,
          });
          this.navCtrl.setRoot(TabsPage);
          loader.present();
        }
        });
  }

  register(){
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 500,
    });
    loader.present();
    this.navCtrl.push(RegisPage);
  }

  forgotpassword(){
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 500,
    });
    loader.present();
    this.navCtrl.push(ForgotPasswordPage);
  }

  login(){
    if(this.inputlogin.value.username !="" && this.inputlogin.value.password !=""){
      // console.log("username", this.inputlogin.value.username);
      // console.log("password",this.inputlogin.value.password);
      let url = Enums.APIURL.URL+'/passenger/user='+this.inputlogin.value.username+'&&'+'pass='+ Md5.hashStr(this.inputlogin.value.password);
      this.http.get(url).map(res=>res.json()).subscribe((data:any={})=>{
        let account = {
          userid:data['p_id'],
          username:data['p_username'],
          password:data['p_password']
        }
          if(data!=false){
              console.log(data);
              // if(data['u_type'] == "driver"){
                const loader = this.loadingCtrl.create({
                  content: "Please wait...",
                  duration: 500,
                });
                loader.present();
                let datatrack = {
                  driver_id : null,
                  vanid:null,
                  status:0
                }
                this.storage.set('trackvan',datatrack);
                  this.storage.set('accoutuser',account)
                this.navCtrl.setRoot(TabsPage);
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
}
