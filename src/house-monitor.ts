import {ComponentMetadata as Component, ViewMetadata as View, CORE_DIRECTIVES} from 'angular2/angular2';

@Component({
  selector: 'house-monitor'
})

@View({
  directives: [CORE_DIRECTIVES],
  templateUrl:'house-monitor.html'
})

export class HouseMonitor {
  tempF:Number;
  motionEvents:Array;

  constructor() {
    console.info('HouseMonitor Component Mounted Successfully');
    this.tempF= 68.3;
    this.motionEvents = [
      {
        date: new Date(),
        thumb: 'images/sampleEventThumb.jpg',
        fullUrl: 'images/sampleEventFull.jpg'
      },
      {
        date: new Date(),
        thumb: 'images/sampleEventThumb.jpg',
        fullUrl: 'images/sampleEventFull.jpg'
      },
      {
        date: new Date(),
        thumb: 'images/sampleEventThumb.jpg',
        fullUrl: 'images/sampleEventFull.jpg'
      }
    ]
  }
}
