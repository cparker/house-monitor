import {Http, Response} from 'angular2/http'
import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';
import {MockDataService} from './mock-data-service';
import {DataService} from './data-service';


@Component({
  selector: 'house-temp'
})

@View({
  directives: [CORE_DIRECTIVES],
  template: `
    <div class="temp">
      <div *ng-if="temp">
          <span class="tempValue">{{temp.latest.tempF || 0}} ºF</span> @ {{temp.latest.dateStr}}
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

  constructor(dataService:DataService) {
    console.log('house temp constructor');
    let self = this;
    dataService.getTemp().subscribe(res => self.temp = res);
    console.log('self.temp now', self.temp);
  }

}

