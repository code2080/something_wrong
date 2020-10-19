import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { TECoreAPIProvider, configureTECoreAPI } from './TECoreAPI';

// REDUX
import configureStore from '../Redux/store';
import { validateLogin } from '../Redux/Auth/auth.actions';
import { SET_ENVIRONMENT } from '../Redux/Auth/auth.actionTypes';

// COMPONENTS
import TEPrefsLibRouter from './TEPrefsLibRouter';

// STYLES
import './TEPrefsLib.scss';

// Configure store and attach to window object
const store = configureStore();
window.tePrefsLibStore = store;
window.tePrefsScroll = [0, 0];
window.tePrefsOffset = [0, 0];

// Hack to get babel's async runtime generators to work
Promise.resolve();

// Validate token presence
store.dispatch(validateLogin());

const TEPrefsLib = ({ coreAPI: _teCoreAPI, env }) => {
  const teCoreAPI = configureTECoreAPI(_teCoreAPI);
  const prefsRef = useRef(null);
  useEffect(() => {
    window.tePrefsLibStore.dispatch({ type: SET_ENVIRONMENT, payload: { env } });
  }, []);

  useEffect(() => {
    const { x, y } = prefsRef.current && prefsRef.current.getBoundingClientRect();
    window.tePrefsOffset = [x, y];
    window.tePrefsLibStore.getState().globalUI.spotlightPositionInfo && console.log(`x: ${window.tePrefsOffset[0]}, y: ${window.tePrefsOffset[1]}: Offset in TePrefsLib div`);
  }, [prefsRef.current && prefsRef.current.getBoundingClientRect()])

  return (
    <Provider store={store}>
      <TECoreAPIProvider api={teCoreAPI}>
        <div
          className='te-prefs-lib'
          id="te-prefs-lib"
          ref={prefsRef}
          onScroll={() => window.tePrefsScroll = prefsRef.current && [prefsRef.current.scrollLeft, prefsRef.current.scrollTop]}
        >
          <TEPrefsLibRouter />
        </div>
      </TECoreAPIProvider>
    </Provider>
  );
};

TEPrefsLib.propTypes = {
  coreAPI: PropTypes.object,
  env: PropTypes.string,
};

TEPrefsLib.defaultProps = {
  coreAPI: {},
  env: 'production',
};

export default TEPrefsLib
