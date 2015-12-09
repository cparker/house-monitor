export class ApplicationState {
  static instance:ApplicationState;
  static isCreating:Boolean = false;

  isLoggedIn:boolean;


  constructor() {
    if (!ApplicationState.isCreating) {
      throw new Error("cant new a singleton");
    }

    let self = this;
    self.isLoggedIn = false;
  }

  static getInstance():ApplicationState {
    if (ApplicationState.instance == null) {
      ApplicationState.isCreating = true;
      ApplicationState.instance = new ApplicationState();
      ApplicationState.isCreating = false;
    }

    return ApplicationState.instance;
  }
}
