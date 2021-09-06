import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../Redux/store';
import { MemoryRouter as Router } from 'react-router-dom';

import { ConfigProvider } from 'antd';

const antdConfig = {
  dropdownMatchSelectWidth: false,
  getPopupContainer: () =>
    document.getElementById('te-prefs-lib') as HTMLElement,
};

export const renderWithState = (
  ui: ReactElement<any, string | JSXElementConstructor<any>>,
  {
    initialState = {},
    ...renderOptions
  }: RenderOptions & { initialState?: any } = {},
) => {
  const store = configureStore(initialState);
  const Wrapper = ({ children }: { children?: ReactNode }) => {
    (window as any).tePrefsLibStore = store;
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

interface TestData<ArgType, ExpectedType> {
  args: ArgType;
  expected: ExpectedType;
}
export type TestMetaData<ArgType = any, ExpectedType = any> = [
  message: string,
  testVars: TestData<ArgType, ExpectedType>,
];

type Test<ArgType, ExpectedType> = (
  data: TestData<ArgType, ExpectedType>,
) => void;

/**
 * This will run the testFn for all the data in testData
 */
export const parameterizedTest = <ArgType, ExpectedType>(
  testData: TestMetaData<ArgType, ExpectedType>[],
  testFn: Test<ArgType, ExpectedType>,
) =>
  test.each<TestMetaData<ArgType, ExpectedType>>(testData)('%s', (_, data) =>
    testFn(data),
  );
