import {Http, Response} from 'angular2/http'
import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';
import {MockDataService} from './mock-data-service';
import {DataService} from './data-service';


@Component({
  selector: 'login'
})


@View({
  directives: [CORE_DIRECTIVES],
  template: `
  <div class='login'>
  <h1>login</h1>
  </div>
  `,
  styles: [`
    .login {
       position:absolute;
       height:100%;
       width:100%;
    }
  `]
})

export class Login {
  isLoggedIn:boolean;

  constructor() {
    let self = this;
    self.isLoggedIn = false;
  }
}
