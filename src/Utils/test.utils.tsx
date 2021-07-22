import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../Redux/store';
import { TECoreAPIProvider, configureTECoreAPI } from 'Components/TECoreAPI';
import { MemoryRouter as Router } from 'react-router-dom';

import { ConfigProvider } from 'antd';

const antdConfig = {
  dropdownMatchSelectWidth: false,
  getPopupContainer: () => document.getElementById('te-prefs-lib'),
};

export const renderWithState = (
  ui: ReactElement<any, string | JSXElementConstructor<any>>,
  {
    initialState = {},
    ...renderOptions
  }: RenderOptions & { initialState?: any } = {},
) => {
  const store = configureStore(initialState);
  const Wrapper = ({
    children,
    _teCoreAPI,
  }: {
    children?: ReactNode;
    _teCoreAPI: any;
  }) => {
    const teCoreAPI = configureTECoreAPI(_teCoreAPI);
    window.tePrefsLibStore = store;
    return (
      <Provider store={store}>
        <ConfigProvider {...antdConfig}>
          <Router>
            <div id='te-prefs-lib'>{children}</div>
          </Router>
        </ConfigProvider>
      </Provider>
    );
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};
