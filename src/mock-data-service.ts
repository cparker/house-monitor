import {Injectable} from 'angular2/angular2';

@Injectable()
export class MockDataService {
  temp:Object;
  events:Array<any>;

  constructor() {
    console.log('mock DataService');

    this.temp = {
      "all": [
        {
          "date": moment("2015-11-27T19:08:52.335Z").toDate(),
          "tempF": 45.1
        },
        {
          "date": moment("2015-11-28T19:09:08.779Z").toDate(),
          "tempF": 45.1
        }
      ],
      "latest": {
        "dateStr" : "Mon Dec 7th, 7:07 MDT",
        "date": moment("2015-11-29T19:09:49.947Z").toDate(),
        "tempF": 45.1
      }
    };


    this.events = [
      {
        eventDate: new Date(),
        pic: 'images/sampleEvent.jpg',
        vid: 'images/sampleEvent.mp4'
      },
      {
        eventDate: new Date(),
        pic: 'images/sampleEvent.jpg',
        vid: 'images/sampleEvent.mp4'
      },
      {
        eventDate: new Date(),
        pic: 'images/sampleEvent.jpg',
        vid: 'images/sampleEvent.mp4'
      }
    ]
  }

  getTemp() {
    return this.temp;
  }

  getEvents() {
    return this.events;
  }

}
