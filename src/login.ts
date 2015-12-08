import {Http, Response} from 'angular2/http'
import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';
import {ApplicationState} from './application-state';


@Component({
  selector: 'login'
})


@View({
  directives: [CORE_DIRECTIVES],
  template: `
  <div *ng-if="!applicationState.isLoggedIn" class='login'>
  <h1>logged in {{applicationState.isLoggedIn}}</h1>
  </div>
  `,
  styles: [`
    .login {
       background-color: gray;
       border: 1px solid red;
       position:absolute;
       height:100%;
       width:100%;
    }
  `]
})

export class Login {
  applicationState:ApplicationState;

  constructor() {
    console.log('login');
    let self = this;
    self.applicationState = ApplicationState.getInstance();
  }
}
