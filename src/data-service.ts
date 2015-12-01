import {Http, Response} from 'angular2/http'
import {Injectable} from 'angular2/angular2';

@Injectable()
export class DataService {
  http:Http;
  temp:Object;
  events:Array;

  constructor(http:Http) {
    console.log('DataService');
    this.http = http;
  }

  getTemp() {
    return this.temp;
  }

  getEvents() {
    return this.events;
  }


  fetchTemp() {
    this.http.get('http://localhost:3000/temp')
      .map(res => res.json())
      .subscribe(
        data => this.temp = data,
        err => console.log('ERRRRR', err),
      () => console.log('getTemp complete')
    );
  }

  transformEventDates(events) {

    return _.map(events, function(e) {
      return moment(e.eventDate).toDate();
    })

  }

  fetchEvents() {
    this.http.get('http://localhost:3000/motion')
      .map(res => res.json())
      .subscribe(
        data => this.events = this.transformEventDates(data),
        err => console.log('ERRRRR', err),
      () => console.log('getTemp complete')
    );
  }

}
