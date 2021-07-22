import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { useForm } from 'antd/lib/form/Form';
import {
  JSXElementConstructor,
  ReactChild,
  ReactElement,
  ReactChildren,
} from 'react';

import { renderWithState } from 'Utils/test.utils';
import { storeForTestingFilter } from 'Mock/Store';

import FilterModalContainer from '../FilterModalContainer';
export const renderWithFilterModalContext = (
  ui: ReactElement<any, string | JSXElementConstructor<any>>,
  { ...renderOptions }: RenderOptions & { initialState?: any } = {},
) => {
  const Wrapper = ({ children }: { children: ReactChild | ReactChildren }) => {
    return <div>{children}</div>;
  };
  return rtlRender(ui, {
    wrapper: renderWithState(Wrapper, { initialState: storeForTestingFilter }),
    ...renderOptions,
  });
};
