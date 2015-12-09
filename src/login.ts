import {Http, Response} from 'angular2/http'
import {Output, EventEmitter, Component, View, CORE_DIRECTIVES, Validators, FormBuilder} from 'angular2/angular2';
import {DataService} from './data-service';
import {EventService} from './event-service';


@Component({
  selector: 'login'
})


@View({
  directives: [CORE_DIRECTIVES],
  template: `
  <div *ng-if="!isLoggedIn" class='login'>
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
  loginForm:any;
  dataService:DataService;
  eventService:EventService;

  // assume true, and the first time the app calls REST apis, they will 401, which will set this to false
  // and show the modal login dialog
  isLoggedIn:boolean = true;

  constructor(fb:FormBuilder, dataService:DataService, eventService:EventService) {
    console.log('login');
    let self = this;
    self.dataService = dataService;
    self.eventService = eventService;

    this.loginForm = fb.group({
      password: ["", Validators.required]
    });

    // register for the unauthorized event so we can change isLoggedIn
    eventService.emitter.subscribe(event => {
        if (event == 'unauthorized') {
          console.log('received unauthorized event');
          self.isLoggedIn = false;
        }
      },
        err => console.log(err),
        complete => console.log(complete)
    );
  }

  doLogin(event) {
    var self = this;
    console.log('login event', this.loginForm.value);
    event.preventDefault();

    self.dataService.submitLogin(this.loginForm.controls.password.value).subscribe(
        res => {
        console.log('login successful');
        self.eventService.emitter.next('login-successful');
        self.isLoggedIn = true;
      },
        err => {
        console.log('login error', err);
      }
    );


  }
}
