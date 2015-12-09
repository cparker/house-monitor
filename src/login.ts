import {Http, Response} from 'angular2/http'
import {Component, View, CORE_DIRECTIVES, Validators, FormBuilder} from 'angular2/angular2';
import {ApplicationState} from './application-state';
import {DataService} from './data-service';


@Component({
  selector: 'login'
})


@View({
  directives: [CORE_DIRECTIVES],
  template: `
  <div *ng-if="!applicationState.isLoggedIn" class='login'>
      <div class="login-fields">
          <form [ng-form-model]="loginForm" (submit)="doLogin($event)">
              <div class="password-field"><input ng-control="password" class="password-input" type="password" placeholder="password"/></div>
              <div class="button submit"><input type="submit">submit</input></div>
          </form>
      </div>
  </div>
  `,
  styles: [`
    .login {
       background-color: rgba(200,200,200,1.0);
       position:absolute;
       height:95%;
       width:95%;
    }

    .login-fields {
      padding: 10px;
    }

    .password-field {
      width: 17.0em;
      padding-top: 4px;
    }

    .password-input {
      border: 3px solid gray;
    }

  `]
})

export class Login {
  applicationState:ApplicationState;
  loginForm:any;
  dataService:DataService;

  constructor(fb:FormBuilder, dataService:DataService) {
    console.log('login');
    let self = this;
    self.applicationState = ApplicationState.getInstance();
    self.dataService = dataService;

    this.loginForm = fb.group({
      password: ["", Validators.required]
    });
  }

  doLogin(event) {
    var self = this;
    console.log('login event', this.loginForm.value);
    event.preventDefault();

    self.dataService.submitLogin(this.loginForm.controls.password.value).subscribe(
        res => {
        console.log('login successful');
        self.applicationState.isLoggedIn = true;
      },
        err => {
        console.log('login error', err);
        self.applicationState.isLoggedIn = false;
      }
    );


  }
}
