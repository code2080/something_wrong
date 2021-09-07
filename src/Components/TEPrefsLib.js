import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import configureStore from '../Redux/store';

// REDUX
import { validateLogin } from '../Redux/Auth/auth.actions';
import { SET_ENVIRONMENT, SET_CORE_USER } from '../Redux/Auth/auth.actionTypes';

// COMPONENTS
import { ConfirmLeavingPageProvider } from '../Hooks/ConfirmLeavingPageContext';
import TEPrefsLibRouter from './TEPrefsLibRouter';
import { TECoreAPIProvider, configureTECoreAPI } from './TECoreAPI';

// STYLES
import './TEPrefsLib.scss';

const antdConfig = {
  dropdownMatchSelectWidth: false,
  getPopupContainer: () => document.getElementById('te-prefs-lib'),
};

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
  }, [teCoreAPI]);

  useEffect(() => {
    window.tePrefsLibStore.dispatch({
      type: SET_ENVIRONMENT,
      payload: { env },
    });
    // Validate token presence
    store.dispatch(validateLogin());
  }, [env]);

  useEffect(() => {
    const { x, y, height } =
      prefsRef.current && prefsRef.current.getBoundingClientRect();
    window.tePrefsOffset = [x, y];
    window.tePrefsHeight = height;
  });

  return (
    <Provider store={store}>
      <TECoreAPIProvider api={teCoreAPI} mixpanel={mixpanel}>
        <ConfigProvider {...antdConfig}>
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
            <ConfirmLeavingPageProvider>
              <TEPrefsLibRouter />
            </ConfirmLeavingPageProvider>
          </div>
        </ConfigProvider>
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
