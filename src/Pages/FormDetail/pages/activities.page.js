import { useEffect, useMemo, useState } from 'react';
import { /* useDispatch, */ useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';

// COMPONENtS
import ActivitiesToolbar from '../../../Components/ActivitiesToolbar';

// SELECTORS
import { makeSelectActivitiesForForm } from '../../../Redux/Activities/activities.selectors';
import { selectDesignForForm } from '../../../Redux/ActivityDesigner/activityDesigner.selectors';
import { selectVisibleActivitiesForForm } from '../../../Redux/Filters/filters.selectors';
import { createLoadingSelector } from '../../../Redux/APIStatus/apiStatus.selectors';

// HELPERS
import { createActivitiesTableColumnsFromMapping } from '../../../Components/ActivitiesTableColumns/ActivitiesTableColumns';
// import { getFilterPropsForActivities } from '../../../Utils/activities.helpers';

// ACTIONS
// import { setActivityFilter } from '../../../Redux/Filters/filters.actions';

// HOOKS
import useActivityScheduling from '../../../Hooks/activityScheduling';
import { getExtIdsFromActivities } from '../../../Utils/ActivityValues/helpers';
import VirtualTable from '../../../Components/VirtualTable/VirtualTable';

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
  return window.tePrefsHeight - 110;
};

const ActivitiesPage = () => {
  const { formId } = useParams();
  // const dispatch = useDispatch();

  /**
   * SELECTORS
   */
  const selectActivitiesForForm = useMemo(
    () => makeSelectActivitiesForForm(),
    [],
  );
  const activities = useSelector((state) =>
    selectActivitiesForForm(state, formId),
  );
  const design = useSelector(selectDesignForForm)(formId);
  const visibleActivities = useSelector(selectVisibleActivitiesForForm)(formId);
  const isLoading = useSelector(
    createLoadingSelector(['FETCH_ACTIVITIES_FOR_FORM']),
  );
  const [formType, reservationMode] = useSelector((state) => {
    const form = state.forms[formId];
    return [form.formType, form.reservationMode];
  });

  useEffect(() => {
    getExtIdsFromActivities(activities);
  }, [activities]);
  /**
   * HOOKS
   */
  const { handleScheduleActivities } = useActivityScheduling({
    formId,
    formType,
    reservationMode,
  });

  const [yScroll] = useState(calculateAvailableTableHeight());

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

  // TODO: Fix this!! DEV-8479
  // useEffect(() => {
  //   console.log('Running filterprops');
  //   const { options, matches } = getFilterPropsForActivities(activities);
  //   dispatch(setActivityFilter({ filterId: formId, options, matches }));
  // }, [activities, dispatch, formId]);

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

  const onScheduleActivities = async (activities) => {
    await handleScheduleActivities(activities);
    onDeselectAll();
  };

  return (
    <>
      <ActivitiesToolbar
        selectedRowKeys={selectedRowKeys}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
        onScheduleActivities={onScheduleActivities}
        allActivities={tableDataSource}
      />
      <VirtualTable
        scroll={{ y: yScroll }}
        columns={tableColumns}
        dataSource={tableDataSource}
        rowKey='_id'
        loading={isLoading && (activities || []).length === 0}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
        }}
      />
    </>
  );
};

export default ActivitiesPage;
