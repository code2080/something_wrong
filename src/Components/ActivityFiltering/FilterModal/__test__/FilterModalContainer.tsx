import { RenderOptions } from '@testing-library/react';
import { JSXElementConstructor, ReactElement } from 'react';

import { renderWithState } from '../../../../Utils/test.utils';
import { storeForTestingFilter } from '../../../../Mock/Store';

export const renderWithFilterModalContext = (
  ui: ReactElement<any, string | JSXElementConstructor<any>>,
  { ...renderOptions }: RenderOptions = {},
) => {
  return renderWithState(ui, {
    initialState: storeForTestingFilter,
    ...renderOptions,
  });
};
