import {
  fireEvent,
  queryByAttribute,
  screen,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterModal from '../FilterModal';
import { storeForTestingFilter } from 'Mock/Store';

import { renderWithState } from 'Utils/test.utils';

const getById = queryByAttribute.bind(null, 'id');

let results;
describe('Filter Modal tests', () => {
  beforeEach(() => {
    results = renderWithState(
      <FilterModal formId='60acfd026b58240023ae588b' isVisible />,
      {
        initialState: storeForTestingFilter,
      },
    );
  });

  it('Render without crashes', () => {
    expect(screen.getByText('Filter activities')).toBeInTheDocument();
    expect(screen.getByText('Start time')).toBeInTheDocument();
    expect(screen.getByText('End time')).toBeInTheDocument();
  });

  it('Change property', async () => {
    fireEvent.click(screen.getByText('Start time'));
    await waitFor(() => {
      expect(screen.getByText('Start time').parentElement).toHaveClass(
        'ant-menu-item-selected',
      );
      expect(screen.getByText('Select start time')).toBeInTheDocument();
    });
  });

  it('Try to change values', async () => {
    fireEvent.click(screen.getByText('Start time'));
    await waitFor(async () => {
      expect(document.querySelector('.ant-picker')).toBeInTheDocument();
      fireEvent.mouseDown(document.querySelector('.ant-picker'));
      // console.log(getById(results.container ,'startTime'));
      //   fireEvent.click(screen.getByText('Select time'));
    });
    await waitFor(() => {
      expect(document.querySelector('.ant-picker')).toHaveClass(
        'ant-picker-focused',
      );
      // fireEvent.click(screen.getAllByText('04')[0]);
      // fireEvent.click(screen.getAllByText('10')[0]);
      // expect(screen.getByText('01:01')).toBeInTheDocument();
    });
  });
});
