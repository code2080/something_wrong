import React from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import DynamicTable from '../DynamicTable/DynamicTableHOC';

const BaseSectionTableView = ({ columns, dataSource }) => (
  <DynamicTable
    columns={columns}
    dataSource={dataSource}
    rowKey="rowKey"
    pagination={false}
  />
);

BaseSectionTableView.propTypes = {
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
};

export default BaseSectionTableView;
