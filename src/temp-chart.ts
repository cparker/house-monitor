import {Http, Response} from 'angular2/http'
import {Component, View, CORE_DIRECTIVES,OnInit,AfterContentInit,AfterViewInit} from 'angular2/angular2';
import {MockDataService} from './mock-data-service';
import {EventService} from './event-service';

declare var google;

@Component({
  selector: 'temp-chart'
})

@View({
  directives: [CORE_DIRECTIVES],

  templateUrl: 'tempChart.html',

  styles: [`
  `]
})


export class TempChart implements OnInit, AfterContentInit, AfterViewInit {
  constructor() {
    console.log('TempChart constructor');
  }

  ngOnInit() {
    console.log('ngOnInit got called');
  }

  ngAfterContentInit() {
    console.log('after content init');
  }

  ngAfterViewInit() {
    console.log('after view init');
    var data = google.visualization.arrayToDataTable([
        ['Year', 'Sales', 'Expenses'],
        ['2004', 1000, 400],
        ['2005', 1170, 460],
        ['2006', 660, 1120],
        ['2007', 1030, 540]
      ]);
      var options = {
        title: 'Company Performance',
        curveType: 'function',
        legend : { position : 'bottom' }
      };

    var chart = new google.visualization.LineChart(document.getElementById('chartdiv'));

    chart.draw(data,options);


  }


}
