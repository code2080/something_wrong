import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';

// COMPONENtS
import DynamicTable from '../../../Components/DynamicTable/DynamicTableHOC';
import ExpandedPane from '../../../Components/TableColumns/Components/ExpandedPane';
import ActivitiesToolbar from '../../../Components/ActivitiesToolbar';

// SELECTORS
import { selectActivitiesForForm } from '../../../Redux/Activities/activities.selectors';
import { selectDesignForForm } from '../../../Redux/ActivityDesigner/activityDesigner.selectors';
import { selectVisibleActivitiesForForm } from '../../../Redux/Filters/filters.selectors';

// HELPERS
import { stringIncludes, anyIncludes } from '../../../Utils/validation';
import { createActivitiesTableColumnsFromMapping } from '../../../Components/ActivitiesTableColumns/ActivitiesTableColumns';

// CONSTANTS
import { DATE_TIME_FORMAT } from '../../../Constants/common.constants';
import { tableViews } from '../../../Constants/tableViews.constants';

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

const getActivityDataSource = (activities = {}, visibleActivities) => {
  // Order by formInstanceId and then sequenceIdx or idx
  return (Object.keys(activities) || []).reduce((a, formInstanceId) => {
    const formInstanceActivities = activities[formInstanceId].filter(el => {
      if (visibleActivities === 'ALL') return true;
      return visibleActivities.indexOf(el._id) > -1;
    });
    const orderedFormInstanceActivities = _.orderBy(formInstanceActivities, ['sequenceIdx'], ['asc']);
    return [
      ...a,
      ...orderedFormInstanceActivities,
    ];
  }, []);
};

const ActivitiesPage = () => {
  const { formId } = useParams();

  /**
   * SELECTORS
   */
  const activities = useSelector(selectActivitiesForForm)(formId);
  const design = useSelector(selectDesignForForm)(formId);
  const visibleActivities = useSelector(selectVisibleActivitiesForForm)(formId);

  const tableColumns = design ? createActivitiesTableColumnsFromMapping(design, true) : [];
  const tableDataSource = getActivityDataSource(activities, visibleActivities);

  /**
   * STATE
   */
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  /**
   * EVENT HANDLERS
   */
  const onSelectAll = () => {
    setSelectedRowKeys(tableDataSource.map(a => a._id));
  };

  const onDeselectAll = () => {
    setSelectedRowKeys([]);
  };

  return (
    <React.Fragment>
      <ActivitiesToolbar
        selectedRowKeys={selectedRowKeys}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
      />
      <DynamicTable
        columns={tableColumns}
        dataSource={tableDataSource}
        rowKey="_id"
        datasourceId={`${tableViews.ACTIVITIES}-${formId}`}
        expandedRowRender={row => <ExpandedPane columns={tableColumns} row={row} />}
        resizable
        onSearch={filterFn}
        rowSelection={{
          selectedRowKeys,
          onChange: selectedRowKeys => setSelectedRowKeys(selectedRowKeys),
        }}
      />
    </React.Fragment>
  );
};

export default ActivitiesPage;
