import React from 'react';
import PropTypes from 'prop-types';

// COMPONENtS
import DynamicTable from '../DynamicTable/DynamicTableHOC';

// HELPERS
import { createActivitiesTableColumnsFromMapping } from '../ActivitiesTableColumns/ActivitiesTableColumns';

const ActivitiesTable = ({
  mapping,
  activities,
}) => {
  const columns = mapping ? createActivitiesTableColumnsFromMapping(mapping) : [];
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
