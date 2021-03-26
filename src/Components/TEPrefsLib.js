import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { TECoreAPIProvider, configureTECoreAPI } from './TECoreAPI';

// REDUX
import configureStore from '../Redux/store';
import { validateLogin } from '../Redux/Auth/auth.actions';
import { SET_ENVIRONMENT, SET_CORE_USER } from '../Redux/Auth/auth.actionTypes';

// COMPONENTS
import TEPrefsLibRouter from './TEPrefsLibRouter';

// STYLES
import './TEPrefsLib.scss';

// Configure store and attach to window object
const store = configureStore();
window.tePrefsLibStore = store;
window.tePrefsScroll = [0, 0];
window.tePrefsOffset = [0, 0];
window.tePrefsHeight = 0;

// Hack to get babel's async runtime generators to work
Promise.resolve();

const TEPrefsLib = ({ mixpanel, coreAPI: _teCoreAPI, env }) => {
  const teCoreAPI = configureTECoreAPI(_teCoreAPI);
  const prefsRef = useRef(null);

  useEffect(() => {
    teCoreAPI.getCurrentUser({
      callback: (user) =>
        window.tePrefsLibStore.dispatch({
          type: SET_CORE_USER,
          payload: { userId: user.userId },
        }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.tePrefsLibStore.dispatch({
      type: SET_ENVIRONMENT,
      payload: { env },
    });
    // Validate token presence
    store.dispatch(validateLogin());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { x, y, height } =
      prefsRef.current && prefsRef.current.getBoundingClientRect();
    window.tePrefsOffset = [x, y];
    window.tePrefsHeight = height;
  }, []);

  return (
    <Provider store={store}>
      <TECoreAPIProvider api={teCoreAPI} mixpanel={mixpanel}>
        <div
          className='te-prefs-lib'
          id='te-prefs-lib'
          ref={prefsRef}
          onScroll={() => {
            window.tePrefsScroll = prefsRef.current && [
              prefsRef.current.scrollLeft,
              prefsRef.current.scrollTop,
            ];
          }}
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
  mixpanel: PropTypes.object,
};

TEPrefsLib.defaultProps = {
  coreAPI: {},
  env: 'production',
};

export default TEPrefsLib;
