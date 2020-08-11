import React from 'react';
import PropTypes from 'prop-types';

// HELPERS
import { createActivitiesTableColumnsFromMapping } from '../ActivitiesTableColumns/ActivitiesTableColumns';

// COMPONENTS
import DynamicTable from '../DynamicTable/DynamicTableHOC';

const ActivitiesTable = ({ mapping, activities }) => {
  const columns = mapping
    ? createActivitiesTableColumnsFromMapping(mapping)
    : [];
  const dataSource = activities && activities.length ? activities : [];
  return (
    <DynamicTable columns={columns} dataSource={dataSource} rowKey="_id" />
  );
};

ActivitiesTable.propTypes = {
  mapping: PropTypes.object,
  activities: PropTypes.array
};

ActivitiesTable.defaultProps = {
  mapping: null,
  activities: []
};

export default ActivitiesTable;
