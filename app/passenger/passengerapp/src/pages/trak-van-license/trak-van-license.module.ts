import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrakVanLicensePage } from './trak-van-license';

@NgModule({
  declarations: [
    TrakVanLicensePage,
  ],
  imports: [
    IonicPageModule.forChild(TrakVanLicensePage),
  ],
})
export class TrakVanLicensePageModule {}
