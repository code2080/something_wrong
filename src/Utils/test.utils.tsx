import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../Redux/store';

export const renderWithState = (
  ui: ReactElement<any, string | JSXElementConstructor<any>>,
  {
    initialState = {},
    ...renderOptions
  }: RenderOptions & { initialState?: any } = {},
) => {
  const store = configureStore(initialState);
  const Wrapper = ({ children }: { children?: ReactNode }) => (
    <Provider store={store}>
      <div id='te-prefs-lib'>{children}</div>
    </Provider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};
