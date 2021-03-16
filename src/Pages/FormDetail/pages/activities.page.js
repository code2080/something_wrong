import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';

// COMPONENtS
import DynamicTable from '../../../Components/DynamicTable/DynamicTableHOC';
import ActivitiesToolbar from '../../../Components/ActivitiesToolbar';

// SELECTORS
import { selectActivitiesForForm } from '../../../Redux/Activities/activities.selectors';
import { selectDesignForForm } from '../../../Redux/ActivityDesigner/activityDesigner.selectors';
import { selectVisibleActivitiesForForm } from '../../../Redux/Filters/filters.selectors';
import { createLoadingSelector } from '../../../Redux/APIStatus/apiStatus.selectors';

// HELPERS
import { createActivitiesTableColumnsFromMapping } from '../../../Components/ActivitiesTableColumns/ActivitiesTableColumns';

// CONSTANTS
import { tableViews } from '../../../Constants/tableViews.constants';

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
  const isLoading = useSelector(createLoadingSelector(['FETCH_ACTIVITIES_FOR_FORM']));

  /**
   * MEMOIZED PROPS
   */
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

  const memoizedTable = useMemo(() => (
    <DynamicTable
      showFilter={false}
      columns={tableColumns}
      dataSource={tableDataSource}
      rowKey='_id'
      datasourceId={`${tableViews.ACTIVITIES}-${formId}`}
      resizable
      rowSelection={{
        selectedRowKeys,
        onChange: selectedRowKeys => setSelectedRowKeys(selectedRowKeys),
      }}
      pagination={false}
      isLoading={isLoading}
    />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [formId, isLoading, selectedRowKeys, tableDataSource]);

  return (
    <React.Fragment>
      <ActivitiesToolbar
        selectedRowKeys={selectedRowKeys}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
      />
      {memoizedTable}
    </React.Fragment>
  );
};

export default ActivitiesPage;
