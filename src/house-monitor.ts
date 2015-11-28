import {ComponentMetadata as Component, ViewMetadata as View, CORE_DIRECTIVES} from 'angular2/angular2';

@Component({
  selector: 'house-monitor'
})

@View({
  directives: [CORE_DIRECTIVES],
  templateUrl:'house-monitor.html'
})

export class HouseMonitor {
  foo:String;

  constructor() {
    console.info('HouseMonitor Component Mounted Successfully');
    this.foo = 'OK';
  }
}
