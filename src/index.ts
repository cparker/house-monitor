import {HTTP_PROVIDERS} from 'angular2/http';
import {Component, View, bootstrap} from 'angular2/angular2';
import {DataService} from './data-service';
import {MockDataService} from './mock-data-service';
import {HouseTemp} from './house-temp';
import {HouseVideo} from './house-video';
import {Login} from './login';
import {EventService} from './event-service';
import {TempChart} from './temp-chart';

@Component({
  selector: 'main'
})

@View({
  directives: [HouseTemp, HouseVideo, Login, TempChart],

  template: `
    <login></login>
    <house-temp></house-temp>
    <temp-chart></temp-chart>
    <house-video></house-video>
  `
})

class Main {

}

bootstrap(Main, [
  HTTP_PROVIDERS,
  DataService,
  MockDataService,
  HouseTemp,
  HouseVideo,
  Login,
  EventService,
  TempChart
]);
