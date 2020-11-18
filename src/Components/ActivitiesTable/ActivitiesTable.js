import React from 'react';
import PropTypes from 'prop-types';

// COMPONENtS
import DynamicTable from '../DynamicTable/DynamicTableHOC';
import ExpandedPane from '../TableColumns/Components/ExpandedPane'

// HELPERS
import { createActivitiesTableColumnsFromMapping } from '../ActivitiesTableColumns/ActivitiesTableColumns';

// CONSTANTS
import { tableViews } from '../../Constants/tableViews.constants';

const ActivitiesTable = ({
  formInstanceId,
  mapping,
  activities,
}) => {
  const columns = mapping ? createActivitiesTableColumnsFromMapping(mapping) : [];
  const dataSource = activities && activities.length ? activities : [];
  return (
    <DynamicTable
      columns={columns}
      dataSource={dataSource}
      rowKey="_id"
      datasourceId={`${tableViews.ACTIVITIES}-${formInstanceId}`}
      showFilter={false}
      expandedRowRender={row => <ExpandedPane columns={columns} row={row} />}
      resizable
    />
  );
};

ActivitiesTable.propTypes = {
  formInstanceId: PropTypes.string.isRequired,
  mapping: PropTypes.object,
  activities: PropTypes.array
};

ActivitiesTable.defaultProps = {
  mapping: null,
  activities: []
};

export default ActivitiesTable;
