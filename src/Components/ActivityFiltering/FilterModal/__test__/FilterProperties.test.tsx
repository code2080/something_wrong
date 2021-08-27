import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FilterProperties from '../FilterProperties';

import { filterLoopup } from 'Mock/Filter';
import { beautifyObject } from '../FilterModal.helper';
import { omit } from 'lodash';

const filterLookupMap = beautifyObject({
  ...omit(filterLoopup, ['objectFilters']),
  objects: {
    ...filterLoopup.objects,
    ...filterLoopup.objectFilters,
  },
});

const handleSelect = jest.fn();
const getOptionLabel = (field: string, id?: string) => id || field;

describe('Filter Properties column tests', () => {
  beforeEach(() => {
    render(
      <FilterProperties
        filterLookupMap={filterLookupMap}
        selectedProperty='date'
        onSelect={handleSelect}
        getOptionLabel={getOptionLabel}
      />,
    );
  });
  it('Render without crashes', () => {
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();

    // Some objects
    expect(screen.getByText('Submitter')).toBeInTheDocument();
    expect(screen.getByText('room')).toBeInTheDocument();

    // Some fields
    expect(screen.getByText('res.restext')).toBeInTheDocument();
    expect(screen.getByText('res.comment')).toBeInTheDocument();
  });

  it('Click to change property', () => {
    fireEvent.click(screen.getByText('Time'));
    expect(handleSelect).toBeCalledWith('time');
    waitFor(() => {
      expect(
        screen.getByText('Select time interval').parentElement,
      ).toHaveClass('ant-menu-item-selected');
    });
  });
});
