import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { TECoreAPIProvider, configureTECoreAPI } from './TECoreAPI';

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

const TEPrefsLib = ({ coreAPI: _teCoreAPI }) => {
  const teCoreAPI = configureTECoreAPI(_teCoreAPI);
  return (
    <Provider store={store}>
      <TECoreAPIProvider api={teCoreAPI}>
        <div className='te-prefs-lib' id="te-prefs-lib">
          <TEPrefsLibRouter />
        </div>
      </TECoreAPIProvider>
    </Provider>
  );
};

TEPrefsLib.propTypes = {
  coreAPI: PropTypes.object,
};

TEPrefsLib.defaultProps = {
  coreAPI: {},
};

export default TEPrefsLib
