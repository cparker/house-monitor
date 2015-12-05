import {HTTP_PROVIDERS} from 'angular2/http';
import {Component, View, bootstrap} from 'angular2/angular2';
import {HouseMonitor} from './house-monitor';
import {DataService} from './data-service';
import {MockDataService} from './mock-data-service';

@Component({
  selector: 'main'
})

@View({
  directives: [HouseMonitor],

  template: '<house-monitor></house-monitor>'
})

class Main {

}

bootstrap(Main, [HTTP_PROVIDERS,DataService,MockDataService]);
