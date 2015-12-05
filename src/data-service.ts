import {Http, Response} from 'angular2/http'
import {Injectable} from 'angular2/angular2';

@Injectable()
export class DataService {
  http:Http;
  temp:Object;
  events:Array<any>;

  constructor(http:Http) {
    console.log('DataService');
    this.http = http;
  }

  public getTemp():any {

    var self = this;
    var dateFormat = 'MMM Do h:mm a Z';

    self.http.get('/house/api/temp')
      .map(res => (<Response>res).json())
      .subscribe(
      function (data) {

        var xformDates = function (temp) {

          // this works around an issue with angular2 pipes in safari
          // https://github.com/angular/angular/issues/3333
          var latestDateMom = moment(temp.latest.date);
          var latestDateStr = latestDateMom.format(dateFormat);

          var fixed:any = {
            "latest": {
              "dateStr": latestDateStr,
              "date": latestDateMom.toDate(),
              "tempF": temp.latest.tempF
            },
            "all": _.map(temp.all, function (t:any) {
              var dateMom = moment(t.date);
              var dateStr = dateMom.format(dateFormat);
              return {
                "dateStr": dateStr,
                "date": dateMom.toDate(),
                "tempF": t.tempF
              }
            })
          };

          return fixed;
        };

        console.log('temp data looks like', data);
        var newData = xformDates(data);
        console.log('new data looks like', newData);
        self.temp = newData;
      },
        err => console.log('ERRRRR', err),
      () => console.log('getTemp complete')
    );

    return self.temp;


  }

  getEvents() {
    return this.events;
  }


  fetchTemp() {
    this.http.get('http://localhost:3000/temp')
      .map(res => (<any>res).json())
      .subscribe(
        data => this.temp = data,
        err => console.log('ERRRRR', err),
      () => console.log('getTemp complete')
    );
  }

  transformEventDates(events) {

    return _.map(events, function (e) {
      return moment((<any>e).eventDate).toDate();
    })

  }

  fetchEvents() {
    this.http.get('http://localhost:3000/motion')
      .map(res => (<any>res).json())
      .subscribe(
        data => this.events = this.transformEventDates(data),
        err => console.log('ERRRRR', err),
      () => console.log('getTemp complete')
    );
  }

}
