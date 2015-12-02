import {Http, Response} from 'angular2/http'
import {ComponentMetadata as Component, ViewMetadata as View, CORE_DIRECTIVES} from 'angular2/angular2';

@Component({
  selector: 'house-monitor'
})

@View({
  directives: [CORE_DIRECTIVES],
  templateUrl: 'house-monitor.html'
})

export class HouseMonitor {
  http:Http;
  temp:Object;
  events:Array;

  constructor(http:Http) {
    let self = this;
    console.info('HouseMonitor Component Mounted Successfully');
    self.http = http;

    self.temp = {
      latest: {
        tempF: -1,
        date: new Date()
      }
    };
    self.events = [];

    self.http.get('/house/api/temp')
      .map(res => res.json())
      .subscribe(
      function (data) {

        var xformDates = function (temp) {
          var fixed = {
            "latest": {
              "date": moment(temp.latest.date).toDate(),
              "tempF": temp.latest.tempF
            },
            "all": _.map(temp.all, function (t) {
              return {
                "date": moment(t.date).toDate(),
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

    var xformEventDates = function (events) {
      console.log('transforming events', events);
      return _.map(events, function (e) {
        return {
          eventDate: moment(e.eventDate).toDate(),
          pic: e.pic,
          vid: e.vid
        }
      })
    };

    self.http.get('/house/api/motion')
      .map(res => res.json())
      .subscribe(
        data => self.events = xformEventDates(data),
        err => console.log('ERRRRR', err),
      () => console.log('getEvents complete.  self.events now', self.events)
    );


  }

}
