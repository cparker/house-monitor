import {Http, Response} from 'angular2/http'
import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';
import {MockDataService} from './mock-data-service';
import {EventService} from './event-service';


@Component({
  selector: 'temp-chart'
})

@View({
  directives: [CORE_DIRECTIVES],

  templateUrl: 'tempChart.html',

  styles: [`
  `]
})


export class TempChart {
  constructor() {
    console.log('TempChart constructor');
  }
}
