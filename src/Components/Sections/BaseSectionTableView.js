import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

const BaseSectionTableView = ({ columns, dataSource }) => (
  <Table
    columns={columns}
    dataSource={dataSource}
    rowKey="rowKey"
    pagination={{
      size: 'small',
    }}
  />
);

BaseSectionTableView.propTypes = {
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
};

export default BaseSectionTableView;
