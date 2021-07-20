import React from "react";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterItems from '../FilterItems';

import { Form } from 'antd';

import { filterOptions } from 'Mock/Filter';
import { FILTER_ITEMS_MAPPING } from "../FilterModal.constants";

describe('Filter Items column tests', () => {
  it('Render without crashes', () => {
    render(
      <Form>
        <FilterItems selectedProperty={'date'} propertiesMapping={FILTER_ITEMS_MAPPING} filterOptions={filterOptions} />
      </Form>
    );
    expect(screen.getByText('Select date interval')).toBeInTheDocument();
  });

  it('Render time', () => {
    render(
      <Form>
        <FilterItems selectedProperty={'startTime'} propertiesMapping={FILTER_ITEMS_MAPPING} filterOptions={filterOptions} />
      </Form>
    );
    expect(screen.getByText('Select start time')).toBeInTheDocument();
  });
});
