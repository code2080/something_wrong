import { omit } from 'lodash';
import { screen, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import { renderWithState } from 'Utils/test.utils';
import FilterItems from '../FilterItems';

import { filterLoopup } from '../../../../Mock/Filter';
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
    renderWithState(
      <Form>
        <FilterItems
          filterLookupMap={filterLookupMap}
          selectedProperty={'date'}
          getOptionLabel={getOptionLabel}
        />
      </Form>,
      {
        initialState: {
          auth: { env: 'beta', user: { permissions: ['tePref:pic:aebeta'] } },
        },
      },
    );
    expect(screen.getByText('Select date interval')).toBeInTheDocument();
  });

  it('Render time', () => {
    renderWithState(
      <Form>
        <FilterItems
          filterLookupMap={filterLookupMap}
          selectedProperty={'time'}
          getOptionLabel={getOptionLabel}
        />
      </Form>,
      {
        initialState: {
          auth: { env: 'beta', user: { permissions: ['tePref:pic:aebeta'] } },
        },
      },
    );
    expect(screen.getByText('Select time interval')).toBeInTheDocument();
  });

  it('Render submitter', async () => {
    renderWithState(
      <Form>
        <FilterItems
          filterLookupMap={filterLookupMap}
          selectedProperty={'submitter'}
          getOptionLabel={getOptionLabel}
        />
      </Form>,
      {
        initialState: {
          auth: { env: 'beta', user: { permissions: ['tePref:pic:aebeta'] } },
        },
      },
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
    renderWithState(
      <Form>
        <FilterItems
          filterLookupMap={filterLookupMap}
          selectedProperty={'objects.equipment'}
          getOptionLabel={getOptionLabel}
        />
      </Form>,
      {
        initialState: {
          auth: { env: 'beta', user: { permissions: ['tePref:pic:aebeta'] } },
        },
      },
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
    renderWithState(
      <Form>
        <FilterItems
          filterLookupMap={filterLookupMap}
          selectedProperty={'fields.res____restext'}
          getOptionLabel={getOptionLabel}
        />
      </Form>,
      {
        initialState: {
          auth: { env: 'beta', user: { permissions: ['tePref:pic:aebeta'] } },
        },
      },
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
