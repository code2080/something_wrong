import React from "react";
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FilterProperties from "../FilterProperties";

import { propertiesMapping } from 'Mock/Filter';

const handleSelect = jest.fn();

describe('Filter Properties column tests', () => {
  beforeEach(() => {
    render(<FilterProperties selectedProperty={'date'} propertiesMapping={propertiesMapping} onSelect={handleSelect} />);
  });
  it('Render without crashes', () => {
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Start time')).toBeInTheDocument();
    expect(screen.getByText('End time')).toBeInTheDocument();
    // Some objects
    expect(screen.getByText('courseevt')).toBeInTheDocument();
    expect(screen.getByText('equipment')).toBeInTheDocument();

    // Some fields
    expect(screen.getByText('res.restext')).toBeInTheDocument();
    expect(screen.getByText('res.comment')).toBeInTheDocument();
  });

  it('Click to change property', () => {
    fireEvent.click(screen.getByText('Start time'));
    expect(handleSelect).toBeCalledWith('startTime');
    waitFor(() => {
      expect(screen.getByText('Start time').parentElement).toHaveClass('ant-menu-item-selected');
    });
  });
});
