import React from 'react';

const SortableTableCell = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default SortableTableCell;
