import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {HttpModule, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {  NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import * as Enums from '../../enums/enums';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationTrackerProvider {
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;

  constructor(public http: Http,public geolocation:Geolocation,private storage: Storage) {
    console.log('Hello LocationTrackerProvider Provider');
  }



  


}//end
