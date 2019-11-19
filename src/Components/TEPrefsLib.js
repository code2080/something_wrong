import React from 'react';
import { Provider } from 'react-redux';

// REDUX
import configureStore from '../Redux/store';
import { validateLogin } from '../Redux/Auth/auth.actions';

// COMPONENTS
import TEPrefsLibRouter from './TEPrefsLibRouter';

// STYLES
import './TEPrefsLib.scss';

// Configure store and attach to window object
const store = configureStore();
window.tePrefsLibStore = store;

// Hack to get babel's async runtime generators to work
Promise.resolve();

// Validate token presence
store.dispatch(validateLogin());

const configureCoreAPI = (coreAPI) => {
  return {
    get: (callName) => {
      if (coreAPI && coreAPI.hasOwnProperty(callName)) {
        return coreAPI[callName];
      }
      return () => {
        console.log(`${callName} not implemented in provided Core API.`);
      }
    },
    list: () => {
      if (!coreAPI) {
        return [];
      }
      return Object.keys(coreAPI);
    }
  }
};

const TEPrefsLib = (props) => {
  window.coreAPI = configureCoreAPI(props.coreAPI);
  return (
    <Provider store={store}>
      <div className='te-prefs-lib' id="te-prefs-lib">
        <TEPrefsLibRouter />
      </div>
    </Provider>
  );
}

export default TEPrefsLib
