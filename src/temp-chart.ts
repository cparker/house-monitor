/// <reference path="../typings/underscore/underscore.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />

import {Http, Response} from 'angular2/http'
import {Component, View, CORE_DIRECTIVES,OnInit,AfterContentInit,AfterViewInit} from 'angular2/angular2';
import {MockDataService} from './mock-data-service';
import {DataService} from './data-service';
import {EventService} from './event-service';
import {MockTemps} from './mocktemps';

import m = require('moment');

declare
var google;
declare
var _:UnderscoreStatic;

var moment:moment.MomentStatic;
moment = (m as any).default || m;

@Component({
  selector: 'temp-chart'
})

@View({
  directives: [CORE_DIRECTIVES],

  template: `<div class="chart" id="chartdiv"></div>`,

  styles: [`
  `]
})


export class TempChart implements OnInit, AfterContentInit, AfterViewInit {
  mockTemps:Array<any>;
  dataService:DataService;
  temp:any;
  eventService:EventService;

  constructor(mockTemps:MockTemps, dataService:DataService, eventService:EventService) {
    console.log('TempChart constructor');
    var self = this;
    this.mockTemps = mockTemps.temps.all;
    this.dataService = dataService;
    this.eventService = eventService;

    // subscribe to login event so that we know to go grab the data
    // this is for after the user submits the login form
    eventService.emitter.subscribe((event) => {
      console.log('temp-chart received event', event);
      if (event == 'login-successful') {
        self.ngAfterViewInit();
      }
    }, (err) => console.log(err), (comp) => console.log(comp));
  }

  ngOnInit() {
    console.log('ngOnInit got called');
  }

  ngAfterContentInit() {
    console.log('after content init');
  }

  ngAfterViewInit() {
    console.log('after view init called');
    var self = this;

    var drawChart = function (tempData) {
      // make real dates
      var cleanTempData = _.map(tempData.all, _rec => {
        var rec:any = <any>_rec;
        return {
          date: moment(rec.date).toDate(),
          tempF: rec.tempF
        }
      });

      var dayAgo = moment().subtract(1, 'days').toDate();

      var last24 = _.filter(cleanTempData, _d => {
        var d = <any>_d;
        return d.date >= dayAgo;
      });

      var last24columns = _.map(last24, _d => {
        var d = <any>_d;
        return [d.date, d.tempF];
      });

      var last24columnsHeader = [['date', 'tempF']].concat(last24columns);

      var data = google.visualization.arrayToDataTable(last24columnsHeader);

      var options = {
        colors: ['#2f2f2f'],
        legend: {position: 'in'},
        chartArea: {
          left: 30,
          top: 10,
          width: '100%'
        },
        title: 'Temperature over last day',
        curveType: 'function',
        backgroundColor: {fill: 'transparent'},
        hAxis: {
          format: 'hh:mm a',
          gridlines: {count: 6},
          textPosition: 'out',
          slantedText: false
        }

      };

      // this is google charts 1.0, i.e. NOT the material charts
      // i tried using the material charts and ran into too many display problems
      var chart = new google.visualization.LineChart(document.getElementById('chartdiv'));

      //chart.draw(data, google.charts.Line.convertOptions(options));
      chart.draw(data, options);

    };

    self.dataService.getTemp().subscribe(
        res => {
        drawChart(<any>res);
      }
      , err => {
        console.log('got error in getTemp', err);
        if ((<any>err).status === 401) {
          console.log('user needs to authenticate');

          // when the user isnt logged in , we'll end up here (401)
          // send an event
          self.eventService.emitter.next('unauthorized');
        }
      }
    );


  }


}
