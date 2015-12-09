import {EventEmitter} from 'angular2/angular2';

export class EventService {

  emitter: EventEmitter<any>= new EventEmitter();

  constructor() {
  }

  sendLogin() {
      this.emitter.next('login successful');
  }
}
