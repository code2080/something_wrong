import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';

// STYLES
import './BaseSectionListView.scss';

const BaseSectionListView = ({ columns, dataSource }) => (
  <React.Fragment>
    {(dataSource || []).map(el => (
      <Card key={el.rowKey}>
        {(columns || []).map(col => (
          <div className="base-section--list--item" key={col.dataIndex}>
            <span className="title">{col.title}:</span>
            <span className="value">{el[col.dataIndex]}</span>
          </div>
        ))}
      </Card>
    ))}
  </React.Fragment>
);

BaseSectionListView.propTypes = {
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
};

export default BaseSectionListView;
