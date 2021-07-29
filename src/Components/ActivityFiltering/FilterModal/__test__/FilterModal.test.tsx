import moment from 'moment';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterModal from '../FilterModal';
import { storeForTestingFilter } from 'Mock/Store';

import { renderWithState } from 'Utils/test.utils';

describe('Filter Modal tests', () => {
  beforeEach(() => {
    renderWithState(
      <FilterModal formId='60acfd026b58240023ae588b' isVisible />,
      {
        initialState: storeForTestingFilter,
      },
    );
  });

  it('Render without crashes', () => {
    expect(screen.getByText('Filter activities')).toBeInTheDocument();
    expect(screen.getByText('Filter settings')).toBeInTheDocument();
    expect(screen.getByText('Available properties')).toBeInTheDocument();
    expect(screen.getByText('Available filters')).toBeInTheDocument();
    expect(screen.getByText('Selected filters')).toBeInTheDocument();

    // Default property is date
    expect(screen.getByText('Select date interval')).toBeInTheDocument();
  });

  it('Change property', async () => {
    fireEvent.click(screen.getByText('Time'));
    await waitFor(() => {
      expect(screen.getByText('Time').parentElement).toHaveClass(
        'ant-menu-item-selected',
      );
      expect(screen.getByText('Select time interval')).toBeInTheDocument();
    });
  });

  it('Try to change date', async () => {
    const rangePicker = document.querySelector('.ant-picker-range');
    const inputElems = [
      screen.queryByPlaceholderText('Start date'),
      screen.queryByPlaceholderText('End date'),
    ];
    await waitFor(async () => {
      expect(rangePicker).toBeInTheDocument();
      expect(inputElems[0]).toBeInTheDocument();
      expect(inputElems[1]).toBeInTheDocument();
    });

    fireEvent.click(document.querySelector('.ant-picker-range') as Element);
    fireEvent.mouseDown(inputElems[0] as Element);

    await waitFor(async () => {
      const dateInputs = screen.getAllByText('15');
      expect(dateInputs.length).toBeGreaterThan(1);
      await fireEvent.click(dateInputs[0]);
      await fireEvent.click(dateInputs[1]);
    });

    expect(screen.getByText('Date interval:')).toBeInTheDocument();
    expect(
      screen.getByText(
        `${moment().format('YYYY-MM')}-15 ~ ${moment()
          .add(1, 'month')
          .format('YYYY-MM')}-15`,
      ),
    ).toBeInTheDocument();
  });

  it('Try to change time', async () => {
    fireEvent.click(screen.getByText('Time'));
    const rangePicker = document.querySelector('.ant-picker-range');
    const inputElems = [
      screen.queryByPlaceholderText('Start time'),
      screen.queryByPlaceholderText('End time'),
    ];
    await waitFor(async () => {
      expect(rangePicker).toBeInTheDocument();
      expect(inputElems[0]).toBeInTheDocument();
      expect(inputElems[1]).toBeInTheDocument();
    });

    fireEvent.click(document.querySelector('.ant-picker-range') as Element);
    fireEvent.mouseDown(inputElems[0] as Element);

    await waitFor(async () => {
      const hourInput = screen.getByText('09');
      const minuteInput = screen.getByText('30');
      expect(hourInput).toBeInTheDocument();
      expect(minuteInput).toBeInTheDocument();
      await fireEvent.click(hourInput);
      await fireEvent.click(minuteInput);
      fireEvent.click(
        document.querySelector('.ant-picker-ok button') as Element,
      );
    });

    await waitFor(async () => {
      const hourInput = screen.getByText('10');
      const minuteInput = screen.getByText('30');
      expect(hourInput).toBeInTheDocument();
      expect(minuteInput).toBeInTheDocument();
      await fireEvent.click(hourInput);
      await fireEvent.click(minuteInput);
      fireEvent.click(
        document.querySelector('.ant-picker-ok button') as Element,
      );
    });

    expect(screen.getByText('Time interval:')).toBeInTheDocument();
    expect(screen.getByText('09:30 ~ 10:30')).toBeInTheDocument();
  });
});
