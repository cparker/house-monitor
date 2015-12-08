/// <reference path="../typings/underscore/underscore.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />

import {Http, Response} from 'angular2/http'
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

  constructor(http:Http) {
    console.log('DataService constructor');
    this.http = http;
  }

  public getTemp() {

    var self = this;
    var dateFormat = 'MMM Do h:mm a Z';

    return self.http.get('/house/api/temp')
      .map(res => (<Response>res).json())
      .map(x => {
        var tempJson = <any>x;

        // this works around an issue with angular2 pipes in safari
        // https://github.com/angular/angular/issues/3333
        var latestDateMom = moment(tempJson.latest.date);
        var latestDateStr = latestDateMom.format(dateFormat);

        var fixed = {
          "latest": {
            "dateStr": latestDateStr,
            "date": latestDateMom.toDate(),
            "tempF": tempJson.latest.tempF
          },
          "all": _.map(tempJson.all, function (t:any) {
            var dateMom = moment(t.date);
            var dateStr = dateMom.format(dateFormat);
            return {
              "dateStr": dateStr,
              "date": dateMom.toDate(),
              "tempF": t.tempF
            }
          })
        };

        console.log('FFF fixed is',fixed);
        return fixed;

      });

  }

  getEvents() {
    return this.events;
  }


  fetchTemp() {
    this.http.get('http://localhost:3000/temp')
      .map(res => (<any>res).json())
      .subscribe(
        data => this.temp = data,
        err => console.log('ERRRRR', err),
      () => console.log('getTemp complete')
    );
  }

  transformEventDates(events) {

    return _.map(events, function (e) {
      return moment((<any>e).eventDate).toDate();
    })

  }

  fetchEvents() {
    this.http.get('http://localhost:3000/motion')
      .map(res => (<any>res).json())
      .subscribe(
        data => this.events = this.transformEventDates(data),
        err => console.log('ERRRRR', err),
      () => console.log('getTemp complete')
    );
  }

}
