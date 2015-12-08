import {Http, Response} from 'angular2/http'
import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';
import {MockDataService} from './mock-data-service';


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

  constructor(mockDataService:MockDataService) {
    console.log('house video');
    let self = this;
    self.events = mockDataService.getEvents();
  }
}
