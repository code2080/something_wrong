import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

// HELPERS
import { createActivitiesTableColumnsFromMapping } from '../ActivitiesTableColumns/ActivitiesTableColumns';

const AutomaticSchedulingTable = ({ mapping, activities }) => {
  const columns = mapping ? createActivitiesTableColumnsFromMapping(mapping) : [];
  const dataSource = activities && activities.length
    ? activities
    : [];
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey="_id"
    />
  );
};

AutomaticSchedulingTable.propTypes = {
  mapping: PropTypes.object,
  activities: PropTypes.array,
};

AutomaticSchedulingTable.defaultProps = {
  mapping: null,
  activities: [],
};

export default AutomaticSchedulingTable;
