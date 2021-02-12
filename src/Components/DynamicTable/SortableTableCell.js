import React from 'react';
import { PropTypes } from 'prop-types';

const SortableTableCell = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

SortableTableCell.propTypes = {
  children: PropTypes.array,
  className: PropTypes.string,
};

export default SortableTableCell;
