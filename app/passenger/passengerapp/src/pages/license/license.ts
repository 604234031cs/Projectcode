import { Http } from '@angular/http';
import { TrakVanLicensePage } from './../trak-van-license/trak-van-license';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map'
import { AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-license',
  templateUrl: 'license.html',
})
export class LicensePage  implements OnInit {
input:FormGroup;
showdata:any={};
province:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public fb: FormBuilder,public http:Http,public alertCtrl: AlertController) {
    this.loadprovic();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LicensePage');
  }
  ionViewDidLeave (){
    this.input.reset();
  }

  loadprovic(){
    let url = Enums.APIURL.URL+'/provinces';
    this.http.get(url).map(res=>res.json()).subscribe((data:any)=>{
      console.log(data);
      this.province = data;
    });
  }
  searh(){
        let licensevan =this.input.value.text1+'-'+this.input.value.text2 + '-'+this.input.value.text3;
          // console.log(licensevan);
          let url = Enums.APIURL.URL +'/check/'+licensevan
          this.http.get(url).map((res)=>res.json()).subscribe((res)=>{
            this.showdata =res
            // console.log(res);

              if(this.showdata==false){
                const alert = this.alertCtrl.create({
                  title: 'เกิดข้อผิดพลาด!',
                  subTitle: 'ไม่พบข้อมูลที่ค้นหา',
                  buttons: ['OK']
                });
                this.input.reset()
                alert.present();
              }else{
                if(res['status_driver']==0){
                  const alert = this.alertCtrl.create({
                    title: 'เกิดข้อผิดพลาด!',
                    subTitle: 'คนขับอยู่ในสถานะออฟไลท์',
                    buttons: ['OK']
                  });
                  this.input.reset()
                  alert.present();
                }else{
                  this.navCtrl.push(TrakVanLicensePage,this.showdata)
                }
              }
          });

  }

  ngOnInit(): any {
    this.buildForm();
  }


  buildForm(): void {
    this.input = new FormGroup({
      text1: new FormControl("", [
        Validators.required,
        Validators.pattern('([ก-ฮ0-9]){2,3}$')
      ]),
      text2: new FormControl("", [
        Validators.required,
        Validators.pattern('([1-9]){4}$')
      ]),
      text3: new FormControl("", [
        Validators.required
      ]),
    });
  }
}
