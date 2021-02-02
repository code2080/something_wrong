import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

// COMPONENtS
import DynamicTable from '../DynamicTable/DynamicTableHOC';
import ExpandedPane from '../TableColumns/Components/ExpandedPane'

// HELPERS
import { createActivitiesTableColumnsFromMapping } from '../ActivitiesTableColumns/ActivitiesTableColumns';

// CONSTANTS
import { tableViews } from '../../Constants/tableViews.constants';
import { DATE_TIME_FORMAT } from '../../Constants/common.constants';
import { stringIncludes, anyIncludes } from '../../Utils/validation';

const filterFn = (activity, query) => {
  // Search activities by [extId, activityStatus, submissionValues[], value[], timing[].value]
  const validValue =
    stringIncludes(activity.extId, query) ||
    stringIncludes(activity.activityStatus, query) ||
    (activity.values || []).some(item => anyIncludes(item.submissionValue, query) ||
      anyIncludes(item.value, query)
    ) ||
    (activity.timing || []).some(item => item.value && stringIncludes(moment(item.value).format(DATE_TIME_FORMAT), query));
  if (validValue) {
    return true;
  }
  return false;
};

const ActivitiesTable = ({
  formInstanceId,
  mapping,
  activities,
}) => {
  const onMove = (sourceIdx, destinationIdx) => {
    console.log(`Should move ${sourceIdx} to ${destinationIdx}`);
  }

  const columns = mapping ? createActivitiesTableColumnsFromMapping(mapping) : [];
  const dataSource = activities && activities.length ? activities : [];
  return (
    <DynamicTable
      columns={columns}
      dataSource={dataSource}
      rowKey="_id"
      datasourceId={`${tableViews.ACTIVITIES}-${formInstanceId}`}
      expandedRowRender={row => <ExpandedPane columns={columns} row={row} />}
      resizable
      onSearch={filterFn}
      draggable={true}
      onMove={onMove}
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
