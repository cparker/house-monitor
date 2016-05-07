import {Http, Response} from 'angular2/http'
import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';
import {MockDataService} from './mock-data-service';
import {DataService} from './data-service';
import {EventService} from './event-service';

@Component({
  selector: 'house-temp'
})

@View({
  directives: [CORE_DIRECTIVES],
  template: `
    <div class="temp">
      <div *ng-if="temp">
          {{temp.latest.dateStr}}
      </div>
      <div *ng-if="!temp">
      retrieving temp...
      </div>
   </div>
  `,

  styles: [`
    .temp {
       padding-bottom:1.0em;
    }

    .tempValue {
      font-size: 1.4em;
    }
  `]
})

export class HouseTemp {
  temp:Object;
  dataService:DataService;
  eventService:EventService;

  constructor(dataService:DataService, evt:EventService, mockDataService:MockDataService) {
    console.log('house temp constructor');
    let self = this;
    self.dataService = dataService;
    self.eventService = evt;

    self.fetchTemp();
    //self.temp = mockDataService.getTemp();

    // subscribe to login event so that we know to go grab the data
    // this is for after the user submits the login form
    evt.emitter.subscribe((event) => {
      console.log('house-temp received event', event);
      if (event == 'login-successful') {
        self.fetchTemp();
      }
    }, (err) => console.log(err), (comp) => console.log(comp));


  }

  fetchTemp() {
    console.log('fetching temp');
    let self = this;
    self.dataService.getTemp().subscribe(
        res => {
        console.log('got res from getTemp', res);
        self.temp = res;
      }
      ,
        err => {
        console.log('got error in getTemp', err);
        if ((<any>err).status === 401) {
          console.log('user needs to authenticate');

          // when the user isnt logged in , we'll end up here (401)
          // send an event
          self.eventService.emitter.next('unauthorized');
        }
      }
    );
  }


}

