import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListDriverPage } from './list-driver';

@NgModule({
  declarations: [
    ListDriverPage,
  ],
  imports: [
    IonicPageModule.forChild(ListDriverPage),
  ],
})
export class ListDriverPageModule {}
