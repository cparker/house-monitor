/// <reference path="../typings/underscore/underscore.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />

import {Http, Response} from 'angular2/http'
import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';
import {DataService} from './data-service';
import {MockDataService} from './mock-data-service';
import * as moment from 'moment';


declare var _:UnderscoreStatic;

@Component({
  selector: 'house-monitor'
})

@View({
  directives: [CORE_DIRECTIVES],
  templateUrl: 'house-monitor.html'
})

export class HouseMonitor {
  http:Http;
  temp:Object;
  events:Array<Object>;

  constructor(http:Http, dataService:DataService, mockDataService:MockDataService) {
    let self = this;
    console.info('HouseMonitor Component Mounted Successfully');
    self.http = http;

    self.temp = mockDataService.getTemp();

    self.events = mockDataService.getEvents();

    var dateFormat = 'MMM Do h:mm a Z';

    var xformEventDates = function (events) {
      console.log('transforming events', events);
      return _.map(events, function (e:any) {
        var dateMom = moment(e.eventDate);
        var dateStr = dateMom.format(dateFormat);
        return {
          eventDateStr: dateStr,
          eventDate: dateMom.toDate(),
          pic: e.pic,
          vid: e.vid
        }
      })
    };

  }

}
