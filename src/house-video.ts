import {Http, Response} from 'angular2/http'
import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';
import {MockDataService} from './mock-data-service';
import {DataService} from './data-service';
import {EventService} from './event-service';

@Component({
  selector: 'house-video'
})

@View({
  directives: [CORE_DIRECTIVES],
  template: `
    <div class="pic-container">
      <div *ng-for="#event of events" class="pic">
        {{event.eventDateStr}}
        <a href="{{event.vid}}"><div class="pic-inner"><img src="{{event.pic}}"/></div></a>
      </div>
    </div>
  `,

  styles: [`
    .pic {
      padding-bottom: 0.8em;
    }

    .pic-inner img {
      max-width:350px;
      max-height:350px;
    }
  `]
})


export class HouseVideo {
  events:Array<any>;
  dataService:DataService;
  eventService:EventService;


  constructor(dataService:DataService, evt:EventService, mockDataService:MockDataService) {
    console.log('house video constructor');
    let self = this;
    self.dataService = dataService;
    self.eventService = evt;

    self.fetchEvents();
    // self.events = mockDataService.getEvents();

    evt.emitter.subscribe((event) => {
      console.log('house-video received event', event);
      if (event == 'login-successful') {
        self.fetchEvents();
      }
    });
  }

  fetchEvents() {
    let self = this;
    self.dataService.getEvents().subscribe(
        res => self.events = res,
        err => {
        if ((<any>err).status == 401) {
          console.log('user needs to authenticate');
          self.eventService.emitter.next('unauthorized');
        }
      }
    );
  }


}
