import { Key, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createLoadingSelector } from '../../../Redux/APIStatus/apiStatus.selectors';
import { SchedulingColumns } from '../../../Components/ActivitiesTableColumns/SchedulingColumns/SchedulingColumns';
import { StaticColumns } from '../../../Components/ActivitiesTableColumns/StaticColumns/StaticColumns';

// COMPONENtS
import ActivitiesToolbar from '../../../Components/ActivitiesToolbar';
import ActivityTable from './ActivityTable';
// ACTIONS
import {
  setActivitySorting,
  resetActivitySorting,
} from '../../../Redux/GlobalUI/globalUI.actions';

// SELECTORS
import { makeSelectActivitiesForForm } from '../../../Redux/Activities/activities.selectors';

// HELPERS

// HOOKS
import useActivityScheduling from '../../../Hooks/activityScheduling';
import { getExtIdsFromActivities } from '../../../Utils/ActivityValues/helpers';
import _ from 'lodash';
import { makeSelectSortOrderForActivities } from '../../../Redux/GlobalUI/globalUI.selectors';
import { TActivity } from '../../../Types/Activity.type';
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import { Modal } from 'antd';

const ActivitiesPage = () => {
  const dispatch = useDispatch();
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
  const allActivities = Object.values(activities).flat();
  const keyedActivities = _.keyBy(allActivities, '_id');

  const selectActivitySortingOrder = useMemo(
    () => makeSelectSortOrderForActivities(),
    [],
  );
  const sortOrder = useSelector((state) =>
    selectActivitySortingOrder(state, formId),
  );

  const tableDataSource = useMemo(
    () =>
      _.compact<TActivity>(
        sortOrder?.map((activityId) => keyedActivities?.[activityId]) ??
          allActivities,
      ),
    [allActivities, keyedActivities, sortOrder],
  );

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

  const design = useSelector(selectDesignForForm)(formId);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const isLoading = useSelector(
    createLoadingSelector(['FETCH_ACTIVITIES_FOR_FORM']),
  ) as boolean;

  /**
   * EVENT HANDLERS
   */
  const { handleScheduleActivities, handleDeleteActivities } =
    useActivityScheduling({
      formId,
      formType,
      reservationMode,
    });

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

  const onDeleteActivities = async (activities) => {
    Modal.confirm({
      getContainer: () =>
        document.getElementById('te-prefs-lib') || document.body,
      title: 'Delete reservations',
      content: 'Are you sure you want to delete these reservations?',
      onOk: async () => {
        await handleDeleteActivities(activities);
        onDeselectAll();
      },
    });
  };

  const onSortActivities = (sorter): void => {
    if (sorter && sorter.columnKey) {
      if (sorter.order) {
        dispatch(setActivitySorting(formId, sorter.columnKey, sorter.order));
      } else {
        dispatch(resetActivitySorting(formId));
      }
    }
  };

  return (
    <>
      <ActivitiesToolbar
        selectedRowKeys={selectedRowKeys}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
        onScheduleActivities={onScheduleActivities}
        onDeleteActivities={onDeleteActivities}
        allActivities={tableDataSource}
      />
      <ActivityTable
        design={design}
        isLoading={isLoading}
        activities={tableDataSource}
        onSort={onSortActivities}
        selectedActivities={selectedRowKeys}
        onSelect={setSelectedRowKeys}
        additionalColumns={{
          pre: SchedulingColumns(selectedRowKeys),
          post: StaticColumns,
        }}
      />
    </>
  );
};

export default ActivitiesPage;
