import React from 'react';
import { omit } from 'lodash';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterItems from '../FilterItems';

import { Form } from 'antd';
import { filterLoopup } from 'Mock/Filter';
import { beautifyObject } from '../FilterModal.helper';

const filterLookupMap = beautifyObject({
  ...omit(filterLoopup, ['objectFilters']),
  objects: {
    ...filterLoopup.objects,
    ...filterLoopup.objectFilters,
  },
});

const getOptionLabel = (field: string, id?: string) => id || field;

describe('Filter Items column tests', () => {
  it('Render without crashes', () => {
    render(
      <Form>
        <FilterItems
          filterLookupMap={filterLookupMap}
          selectedProperty={'date'}
          getOptionLabel={getOptionLabel}
        />
      </Form>,
    );
    expect(screen.getByText('Select date interval')).toBeInTheDocument();
  });

  it('Render time', () => {
    render(
      <Form>
        <FilterItems
          filterLookupMap={filterLookupMap}
          selectedProperty={'time'}
          getOptionLabel={getOptionLabel}
        />
      </Form>,
    );
    expect(screen.getByText('Select time interval')).toBeInTheDocument();
  });

  it('Render submitter', async () => {
    render(
      <Form>
        <FilterItems
          filterLookupMap={filterLookupMap}
          selectedProperty={'submitter'}
          getOptionLabel={getOptionLabel}
        />
      </Form>,
    );
    await waitFor(() => {
      screen.getAllByText('60924c137c04ee0025094bd0');
    });
    expect(
      screen.getAllByText('60924c137c04ee0025094bd0').length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.queryByText('Should not be on screen'),
    ).not.toBeInTheDocument();
  });

  it('Render an object', async () => {
    render(
      <Form>
        <FilterItems
          filterLookupMap={filterLookupMap}
          selectedProperty={'objects.equipment'}
          getOptionLabel={getOptionLabel}
        />
      </Form>,
    );
    await waitFor(() => {
      screen.getAllByText('equipment_C-KV Hyrbil');
    });
    expect(
      screen.getAllByText('equipment_C-KV Hyrbil').length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.queryByText('Should not be on screen'),
    ).not.toBeInTheDocument();
  });

  it('Render a field', async () => {
    render(
      <Form>
        <FilterItems
          filterLookupMap={filterLookupMap}
          selectedProperty={'fields.res____restext'}
          getOptionLabel={getOptionLabel}
        />
      </Form>,
    );
    await waitFor(() => {
      screen.getAllByText('Quae earum soluta au');
    });
    expect(
      screen.getAllByText('Quae earum soluta au').length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.queryByText('Should not be on screen'),
    ).not.toBeInTheDocument();
  });
});
