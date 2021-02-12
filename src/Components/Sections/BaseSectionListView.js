import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';

// STYLES
import './BaseSectionListView.scss';

const BaseSectionListView = ({ columns, dataSource }) =>
  (dataSource || []).map(el => (
    <Card key={el.rowKey}>
      {(columns || []).map(col => {
        return (
          <div className='base-section--list--item' key={col.dataIndex}>
            <div className='title'>{col.title}:</div>
            <div className='value'>{col.render(el[col.dataIndex])}</div>
          </div>
        );
      })}
    </Card>
  ));

BaseSectionListView.propTypes = {
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
};

export default BaseSectionListView;
