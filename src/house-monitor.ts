import {ComponentMetadata as Component, ViewMetadata as View, CORE_DIRECTIVES} from 'angular2/angular2';

@Component({
  selector: 'house-monitor'
})

@View({
  directives: [CORE_DIRECTIVES],
  templateUrl: 'house-monitor.html'
})

export class HouseMonitor {
  tempF:Number;
  events:Array;

  constructor() {
    console.info('HouseMonitor Component Mounted Successfully');
    this.tempF = 68.3;
    this.events = [
      {
        eventDate: new Date(),
        pic: 'images/sampleEventThumb.jpg',
        vid: 'images/sampleEventFull.jpg'
      },
      {
        eventDate: new Date(),
        pic: 'images/sampleEventThumb.jpg',
        vid: 'images/sampleEventFull.jpg'
      },
      {
        eventDate: new Date(),
        pic: 'images/sampleEventThumb.jpg',
        vid: 'images/sampleEventFull.jpg'
      }
    ]
  }
}
