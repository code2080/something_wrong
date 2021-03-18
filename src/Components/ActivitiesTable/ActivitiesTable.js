import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import _ from 'lodash';

// COMPONENtS
import DynamicTable from '../DynamicTable/DynamicTableHOC';
import ExpandedPane from '../TableColumns/Components/ExpandedPane';

// HELPERS
import { createActivitiesTableColumnsFromMapping } from '../ActivitiesTableColumns/ActivitiesTableColumns';

// CONSTANTS
import { tableViews } from '../../Constants/tableViews.constants';
import { DATE_TIME_FORMAT } from '../../Constants/common.constants';
import { stringIncludes, anyIncludes } from '../../Utils/validation';
import { useDispatch } from 'react-redux';
import { reorderActivities } from '../../Redux/Activities/activities.actions';

const filterFn = (activity, query) => {
  // Search activities by [extId, activityStatus, submissionValues[], value[], timing[].value]
  const validValue =
    stringIncludes(activity.extId, query) ||
    stringIncludes(activity.activityStatus, query) ||
    (activity.values || []).some(
      (item) =>
        anyIncludes(item.submissionValue, query) ||
        anyIncludes(item.value, query),
    ) ||
    (activity.timing || []).some(
      (item) =>
        item.value &&
        stringIncludes(moment(item.value).format(DATE_TIME_FORMAT), query),
    );
  if (validValue) {
    return true;
  }
  return false;
};

const getActivityDataSource = (activities = []) => {
  const hasActivityOrdering = activities.every((a) => a.sequenceIdx != null);
  if (!hasActivityOrdering) return activities;
  return _.orderBy(activities, ['sequenceIdx'], ['asc']);
};

const ActivitiesTable = ({
  formInstanceId,
  formId,
  mapping: design,
  activities,
}) => {
  const dispatch = useDispatch();
  const onMove = (sourceIdx, destinationIdx) => {
    if (sourceIdx !== destinationIdx) {
      dispatch(
        reorderActivities(formId, formInstanceId, sourceIdx, destinationIdx),
      );
    }
  };

  const columns = design ? createActivitiesTableColumnsFromMapping(design) : [];
  const dataSource = getActivityDataSource(activities);

  return (
    <DynamicTable
      columns={columns}
      dataSource={dataSource}
      rowKey='_id'
      datasourceId={`${tableViews.ACTIVITIES}-${formInstanceId}`}
      expandedRowRender={(row) => <ExpandedPane columns={columns} row={row} />}
      resizable
      onSearch={filterFn}
      draggable
      onMove={onMove}
    />
  );
};

ActivitiesTable.propTypes = {
  formInstanceId: PropTypes.string.isRequired,
  formId: PropTypes.string.isRequired,
  mapping: PropTypes.object,
  activities: PropTypes.array,
};

ActivitiesTable.defaultProps = {
  mapping: null,
  activities: [],
};

export default ActivitiesTable;
