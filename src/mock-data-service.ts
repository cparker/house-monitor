import {Injectable} from 'angular2/angular2';

@Injectable()
export class MockDataService {
  temp:Object;
  events:Array<any>;

  constructor() {
    console.log('DataService');

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
        "date": moment("2015-11-29T19:09:49.947Z").toDate(),
        "tempF": 45.1
      }
    };


    this.events = [
      {
        eventDate: new Date(),
        pic: 'images/sampleEventThumb.jpg',
        vid: 'images/sampleBunny.mp4'
      },
      {
        eventDate: new Date(),
        pic: 'images/sampleEventThumb.jpg',
        vid: 'images/sampleBunny.mp4'
      },
      {
        eventDate: new Date(),
        pic: 'images/sampleEventThumb.jpg',
        vid: 'images/sampleBunny.mp4'
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
