import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useVT } from 'virtualizedtableforantd4';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { Table } from 'antd';

// COMPONENtS
import ActivitiesToolbar from '../../../Components/ActivitiesToolbar';
import ColumnHeader from '../../../Components/ActivitiesTableColumns/new/ColumnHeader';

// SELECTORS
import { selectActivitiesForForm } from '../../../Redux/Activities/activities.selectors';
import { selectDesignForForm } from '../../../Redux/ActivityDesigner/activityDesigner.selectors';
import { selectVisibleActivitiesForForm } from '../../../Redux/Filters/filters.selectors';
import { createLoadingSelector } from '../../../Redux/APIStatus/apiStatus.selectors';

// HELPERS
import { createActivitiesTableColumnsFromMapping } from '../../../Components/ActivitiesTableColumns/ActivitiesTableColumns';
import { getFilterPropsForActivities } from '../../../Utils/activities.helpers';
import { setActivityFilter } from '../../../Redux/Filters/filters.actions';

// CONSTANTS
// import { tableViews } from '../../../Constants/tableViews.constants';

const getActivityDataSource = (activities = {}, visibleActivities) => {
  // Order by formInstanceId and then sequenceIdx or idx
  return (Object.keys(activities) || []).reduce((a, formInstanceId) => {
    const formInstanceActivities = activities[formInstanceId].filter((el) => {
      if (visibleActivities === 'ALL') return true;
      return visibleActivities.indexOf(el._id) > -1;
    });
    const orderedFormInstanceActivities = _.orderBy(
      formInstanceActivities,
      ['sequenceIdx'],
      ['asc'],
    );
    return [...a, ...orderedFormInstanceActivities];
  }, []);
};

const calculateAvailableTableHeight = () => {
  const el = document.getElementById('te-prefs-lib');
  const height = el.clientHeight;
  return height - 110;
};

const ActivitiesPage = () => {
  const { formId } = useParams();
  const dispatch = useDispatch();

  /**
   * SELECTORS
   */
  const activities = useSelector(selectActivitiesForForm)(formId);
  const design = useSelector(selectDesignForForm)(formId);
  const visibleActivities = useSelector(selectVisibleActivitiesForForm)(formId);
  const isLoading = useSelector(
    createLoadingSelector(['FETCH_ACTIVITIES_FOR_FORM']),
  );

  const [yScroll] = useState(calculateAvailableTableHeight());

  const [vt] = useVT(
    () => ({ scroll: { y: yScroll }, overscanRowCount: 30 }),
    [],
  );

  /**
   * MEMOIZED PROPS
   */
  const tableColumns = useMemo(
    () => (design ? createActivitiesTableColumnsFromMapping(design, true) : []),
    [design],
  );
  const tableDataSource = useMemo(
    () => getActivityDataSource(activities, visibleActivities),
    [activities, visibleActivities],
  );
  useEffect(() => {
    const { options, matches } = getFilterPropsForActivities(activities);
    dispatch(setActivityFilter({ filterId: formId, options, matches }));
  }, [activities, dispatch, formId]);

  /**
   * STATE
   */
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  /**
   * EVENT HANDLERS
   */
  const onSelectAll = () => {
    setSelectedRowKeys(tableDataSource.map((a) => a._id));
  };

  const onDeselectAll = () => {
    setSelectedRowKeys([]);
  };

  const tableComponents = useMemo(
    () => ({
      ...vt,
      header: {
        cell: ColumnHeader,
      },
    }),
    [vt],
  );

  console.log('yScrollHeight ' + yScroll);
  return (
    <React.Fragment>
      <ActivitiesToolbar
        selectedRowKeys={selectedRowKeys}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
      />
      <Table
        scroll={{ y: yScroll }}
        components={tableComponents}
        columns={tableColumns}
        dataSource={tableDataSource}
        rowKey='_id'
        loading={isLoading}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
        }}
        pagination={false}
      />
    </React.Fragment>
  );
};

export default ActivitiesPage;

/*
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
*/
