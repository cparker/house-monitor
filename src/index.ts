import {HTTP_PROVIDERS} from 'angular2/http';
import {Component, View, bootstrap} from 'angular2/angular2';
import {HouseMonitor} from './house-monitor';
import {DataService} from './data-service';
import {MockDataService} from './mock-data-service';
import {HouseTemp} from './house-temp';
import {HouseVideo} from './house-video';
import {Login} from './login';

@Component({
  selector: 'main'
})

@View({
  directives: [HouseTemp, HouseVideo],

  template: `
    <login></login>
    <house-temp></house-temp>
    <house-video></house-video>
  `
})

class Main {

}

bootstrap(Main, [HTTP_PROVIDERS, DataService, MockDataService, HouseTemp, HouseVideo, Login]);
