import {Http, Response} from 'angular2/http'
import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';
import {MockDataService} from './mock-data-service';
import {DataService} from './data-service';
import {ApplicationState} from './application-state';

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

    .pic-container {
      height:100%;
      overflow: scroll;
    }
  `]
})


export class HouseVideo {
  events:Array<any>;

  constructor(dataService:DataService) {
    console.log('house video');
    let self = this;
    dataService.getEvents().subscribe(
        res => self.events = res,
        err => {
        if ((<any>err).status == 401) {
          console.log('user needs to authenticate');
          ApplicationState.getInstance().isLoggedIn = false;
        }
      }
    );
  }
}
