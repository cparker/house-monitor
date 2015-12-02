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

    var dateFormat = 'MMM Do h:mm a Z';

    self.http.get('/house/api/temp')
      .map(res => res.json())
      .subscribe(
      function (data) {

        var xformDates = function (temp) {

          // this works around an issue with angular2 pipes in safari
          // https://github.com/angular/angular/issues/3333
          var latestDate = moment(temp.latest.date);
          var latestDateStr = moment.format(dateFormat);

          var fixed = {
            "latest": {
              "dateStr": latestDateStr,
              "date": latestDate.toDate(),
              "tempF": temp.latest.tempF
            },
            "all": _.map(temp.all, function (t) {
              var date = moment(t.date).toDate();
              var dateStr = date.format(dateFormat);
              return {
                "dateStr": dateStr,
                "date": date.toDate(),
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
        var dateMom = moment(e.eventDate).toDate();
        var dateStr = dateMom.format(dateFormat);
        return {
          eventDateStr: dateStr,
          eventDate: dateMom.toDate(),
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
