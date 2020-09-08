import React from 'react';
import PropTypes from 'prop-types';

// STYLES
import './ExpandedPane.scss';

const ExpandedPane = ({ columns, row }) => (
  <div className="dynamic-table--expanded__wrapper">
    {(columns || [])
      .filter(col => !col.hideInList)
      .map(col => (
        <div className="dynamic-table--expanded--item" key={col.dataIndex}>
          <div className="title">{col.title}:</div>
          <div className="value">{col.render(row[col.dataIndex])}</div>
        </div>
      ))}
  </div>
);

ExpandedPane.propTypes = {
  columns: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
};

export default ExpandedPane;
