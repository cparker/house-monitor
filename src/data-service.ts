/// <reference path="../typings/underscore/underscore.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />

import {Http, Response, Headers} from 'angular2/http'
import {Injectable} from 'angular2/angular2';
import m = require('moment');

declare var _:UnderscoreStatic;
var moment:moment.MomentStatic;
moment = (m as any).default || m;

@Injectable()
export class DataService {
  http:Http;
  temp:Object;
  events:Array<any>;
  dateFormat:string;
  tempAPI:string;
  eventsAPI:string;
  loginAPI:string;

  constructor(http:Http) {
    console.log('DataService constructor');
    this.http = http;
    this.dateFormat = 'MMM Do h:mm a Z';
    this.tempAPI = '/house/api/temp';
    this.eventsAPI = '/house/api/motion';
    this.loginAPI = '/house/api/login';
  }

  public getTemp() {

    var self = this;

    return self.http.get(self.tempAPI)
      .map(r =>  {
        var res = <any>r;
        if(res.status != 200) { 
          throw res;
        }
        return (<any>res).json();
      })
      .map(x => {
        var tempJson = <any>x;

        // this works around an issue with angular2 pipes in safari
        // https://github.com/angular/angular/issues/3333
        var latestDateMom = moment(tempJson.latest.date);
        var latestDateStr = latestDateMom.format(self.dateFormat);

        return {
          "latest": {
            "dateStr": latestDateStr,
            "date": latestDateMom.toDate(),
            "tempF": tempJson.latest.tempF.toPrecision(3)
          },
          "all": _.map(tempJson.all, function (t:any) {
            var dateMom = moment(t.date);
            var dateStr = dateMom.format(self.dateFormat);
            return {
              "dateStr": dateStr,
              "date": dateMom.toDate(),
              "tempF": t.tempF
            }
          })
        };

      });

  }

  public getEvents() {
    var self = this;

    return self.http.get(self.eventsAPI)
      .map(r => {
        var res = <any>r;
        if(res.status != 200) { throw res; }
        return (<any>res).json();
      })
      .map(x => {
        var eventJson = <any>x;

        var z = _.map(eventJson, function (e) {
          var dateM = moment((<any>e).eventDate);
          (<any>e).eventDateStr = dateM.format(self.dateFormat);
          return e;
        });

        console.log('events',z);
        return z;

      })
  }


  public submitLogin(pw:string) {
    var self = this;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    var submit = 'password='+pw;

    return self.http.post(self.loginAPI, submit, { headers: headers});
  }





}
