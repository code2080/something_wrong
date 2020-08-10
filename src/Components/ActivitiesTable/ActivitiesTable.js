import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

// HELPERS
import { createActivitiesTableColumnsFromMapping } from '../ActivitiesTableColumns/ActivitiesTableColumns';

const ActivitiesTable = ({
  mapping,
  activities,
}) => {
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

ActivitiesTable.propTypes = {
  mapping: PropTypes.object,
  activities: PropTypes.array,
};

ActivitiesTable.defaultProps = {
  mapping: null,
  activities: [],
};

export default ActivitiesTable;
