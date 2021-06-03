import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// COMPONENtS
import ActivitiesToolbar from '../../../Components/ActivitiesToolbar';

// SELECTORS
import { makeSelectActivitiesForForm } from '../../../Redux/Activities/activities.selectors';
import { selectDesignForForm } from '../../../Redux/ActivityDesigner/activityDesigner.selectors';
import { createLoadingSelector } from '../../../Redux/APIStatus/apiStatus.selectors';
import { selectFormObjectRequest } from '../../../Redux/ObjectRequests/ObjectRequestsNew.selectors';

// HELPERS
import { createActivitiesTableColumnsFromMapping } from '../../../Components/ActivitiesTableColumns/ActivitiesTableColumns';

// HOOKS
import useActivityScheduling from '../../../Hooks/activityScheduling';
import { getExtIdsFromActivities } from '../../../Utils/ActivityValues/helpers';
import VirtualTable from '../../../Components/VirtualTable/VirtualTable';

const calculateAvailableTableHeight = () => {
  return (window as any).tePrefsHeight - 110;
};

const ActivitiesPage = () => {
  const { formId } = useParams<{ formId: string }>();

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
  const isLoading = useSelector(
    createLoadingSelector(['FETCH_ACTIVITIES_FOR_FORM']),
  ) as boolean;
  const objectRequests = useSelector(selectFormObjectRequest(formId));
  const [formType, reservationMode] = useSelector((state: any) => {
    const form = state.forms[formId];
    return [form.formType, form.reservationMode];
  });

  useEffect(() => {
    getExtIdsFromActivities(Object.values(activities).flat());
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
    () =>
      design
        ? createActivitiesTableColumnsFromMapping(design, objectRequests, true)
        : [],
    [design, objectRequests],
  );

  const tableDataSource = useMemo(
    () => Object.values(activities).flat(),
    [activities],
  );

  /**
   * STATE
   */
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

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
        loading={isLoading && !activities?.length}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys) =>
            setSelectedRowKeys(selectedRowKeys as string[]),
        }}
      />
    </>
  );
};

export default ActivitiesPage;
