import { LoginPage } from './../login/login';
import { Component,OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
/**
 * Generated class for the RegisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-regis',
  templateUrl: 'regis.html',
})
export class RegisPage  implements OnInit{
  regisResult:FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public alertCtrl:AlertController, public fb: FormBuilder,
  public loadingCtrl: LoadingController) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisPage');
  }

  Register(){
    if(this.regisResult.value.firstname !="" && this.regisResult.value.lastname !="" && this.regisResult.value.email!="" && this.regisResult.value.userid!="" && this.regisResult.value.password!="" &&  this.regisResult.value.phone!=""){
      // console.log("firstname",this.regisResult.firstname);
      // console.log("lastname",this.regisResult.lastname);
      // console.log("email",this.regisResult.email);
      // console.log("iduser",this.regisResult.userid);
      // console.log("password",this.regisResult.password);
      let url = Enums.APIURL.URL+'/register';
      let url2 = Enums.APIURL.URL+'/checkusername/'+ this.regisResult.value.userid;


      this.http.get(url2).map(res=>res.json()).subscribe((err:any)=>{
        if(err['p_username'] == this.regisResult.value.userid ){
          const alert = this.alertCtrl.create({
            title: 'เกิดข้อผิดพลาด',
            subTitle:'username นี้ถูกใช้แล้ว',
            buttons: ['OK']
          });
          alert.present();
        }else if(err['p_username'] != this.regisResult.value.userid){
          let setdata = JSON.stringify({
                fname: this.regisResult.value.firstname,
                lname: this.regisResult.value.lastname,
                email: this.regisResult.value.email,
                phone:  this.regisResult.value.phone,
                username: this.regisResult.value.userid,
                password: Md5.hashStr(this.regisResult.value.password)
              });
              let datapost = JSON.parse(setdata);
          const confirm = this.alertCtrl.create({
            title: 'ยืนยันการลงทะเบียน',
            message: 'กดปุ่มยืนยันเพื่อลงทะเบียนเข้าใช้ระบบ',
            buttons: [
              {
                text: 'ยืนยัน',
                handler: () => {
                  this.http.post(url,datapost).map(res=>res.json()).subscribe((status:any)=>{
                    // console.log(status);
                  if(status=='Success'){
                    const alert = this.alertCtrl.create({
                      title: 'สำเร็จ',
                      subTitle:'ลงะเบียนเรียบร้อย',
                      buttons: [{
                        text:'ตกลง',
                        handler:()=>{
                          const loader = this.loadingCtrl.create({
                            content: "Please wait...",
                            duration: 500,
                          });
                          loader.present();
                          this.navCtrl.setRoot(LoginPage);
                        }
                      }]
                    });
                    alert.present();
                  }
                });
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
      });
    }else{
      const alert = this.alertCtrl.create({
        title:'เกิดข้อผิดพลาด',
        subTitle:'กรุณาใส่ข้อมูล',
        buttons:['ตกลง']
      });
      alert.present();
    }


}//funion


ngOnInit(): any {
  this.buildForm();
}
buildForm(): void {
  this.regisResult = new FormGroup({
    firstname: new FormControl("",[
    Validators.required,
    Validators.pattern('^[ก-๏\s]+$')

  ]),
    lastname: new FormControl("", [
      Validators.required,
      Validators.pattern('^[ก-๏\s]+$')

    ]),
    phone: new FormControl("", [
            Validators.required,
            Validators.pattern('(^0)([1-9]){8}([0-9])$')
    ]),
    email: new FormControl("", [
      Validators.required,
      Validators.email
    ]),
    userid: new FormControl("", [
      Validators.required,
      Validators.pattern('(^[a-zA-Z0-9])+([a-zA-Z0-9._-])*(^\s)*([a-zA-Z0-9]+)$')
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.pattern('.{6,}')
    ])
  });
}


}//end



