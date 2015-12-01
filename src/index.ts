import {HTTP_PROVIDERS} from 'angular2/http';
import {Component, View, bootstrap} from 'angular2/angular2';
import {HouseMonitor} from 'house-monitor';

@Component({
  selector: 'main'
})

@View({
  directives: [HouseMonitor],

  template: '<house-monitor></house-monitor>'
})

class Main {

}

bootstrap(Main, [HTTP_PROVIDERS]);
