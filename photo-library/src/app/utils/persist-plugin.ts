import {getActionTypeFromInstance} from '@ngxs/store';
import {tap} from 'rxjs/operators';

/*
* This plugin will
* 1. Store the state in localstorage, after every action
* 2. After page is refresed, read from localstorage data and write that into state
* */
export function persistPlugin(state: any, action: any, next: any) {

  console.log('entering plugin=================');
  // After every refresh first action fired will be @@INIT
  if (getActionTypeFromInstance(action) === '@@INIT') {

    // reading from local storage and writing into state, when app is refreshed
    let storedStateStr = localStorage.getItem('LOCALSTORAGE_APP_STATE');
    if (storedStateStr !== null) {
      let storedState = JSON.parse(storedStateStr);
      /**
       * Here we have a problem with the deserialization of the Set<Favorite> , needs a way around this issue .
       *
       * */
      console.log(storedState);
      state = {...state, ...storedState};
      return next(state, action);
    }
  }

  return next(state, action).pipe(tap(result => {
  //following code will trigger after reducer
    console.log('Action happened!', result);
    localStorage.setItem('LOCALSTORAGE_APP_STATE', JSON.stringify(result));;
  }));
}
