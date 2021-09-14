import { Key, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';

import { Modal } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import { selectIsBetaOrDev } from 'Redux/Auth/auth.selectors';
import { makeSelectSelectedFilterValues } from 'Redux/Filters/filters.selectors';
import { createLoadingSelector } from '../../../Redux/APIStatus/apiStatus.selectors';
import { SchedulingColumns } from '../../../Components/ActivitiesTableColumns/SchedulingColumns/SchedulingColumns';
import { StaticColumns } from '../../../Components/ActivitiesTableColumns/StaticColumns/StaticColumns';

// COMPONENtS
import ActivitiesToolbar from '../../../Components/ActivitiesToolbar';
// ACTIONS
import {
  setActivitySorting,
  resetActivitySorting,
} from '../../../Redux/GlobalUI/globalUI.actions';
import { fetchActivitiesForForm } from '../../../Redux/Activities/activities.actions';

// SELECTORS
import { makeSelectActivitiesForForm } from '../../../Redux/Activities/activities.selectors';

// HELPERS

// HOOKS
import useActivityScheduling from '../../../Hooks/activityScheduling';
import { getExtIdsFromActivities } from '../../../Utils/ActivityValues/helpers';
import {
  makeSelectSortOrderForActivities,
  makeSelectSortParamsForActivities,
} from '../../../Redux/GlobalUI/globalUI.selectors';
import { TActivity } from '../../../Types/Activity.type';
import ActivityTable from './ActivityTable';

const ActivitiesPage = () => {
  const dispatch = useDispatch();
  const isBeta = useSelector(selectIsBetaOrDev);
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

  // Select filters
  const selectSelectedFilterValues = useMemo(
    () => makeSelectSelectedFilterValues(),
    [],
  );
  const selectedFilterValues = useSelector((state) =>
    selectSelectedFilterValues(state, formId),
  );

  // Select sorting
  const selectActivityParamSorting = useMemo(
    () => makeSelectSortParamsForActivities(),
    [],
  );

  const selectedSortingParams = useSelector((state) =>
    selectActivityParamSorting(state, formId),
  );

  const selectActivitySortingOrder = useMemo(
    () => makeSelectSortOrderForActivities(),
    [],
  );
  const sortOrder = useSelector((state) =>
    selectActivitySortingOrder(state, formId),
  );

  const tableDataSource = useMemo(() => {
    const sortedActivities = _.compact<TActivity>(
      sortOrder?.map((activityId) => keyedActivities?.[activityId]),
    );
    return _.isEmpty(sortedActivities) ? allActivities : sortedActivities;
  }, [allActivities, keyedActivities, sortOrder]);

  const [formType, reservationMode] = useSelector((state: any) => {
    const form = state.forms[formId];
    return [form.formType, form.reservationMode];
  });

  useEffect(() => {
    getExtIdsFromActivities(Object.values(activities).flat());
  }, [activities]);

  useEffect(() => {
    dispatch(
      fetchActivitiesForForm(
        formId,
        selectedFilterValues,
        selectedSortingParams,
      ),
    );
  }, [dispatch, formId, selectedFilterValues, selectedSortingParams]);

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

  const onScheduleActivities = async (activities: TActivity[]) => {
    await handleScheduleActivities(activities);
    onDeselectAll();
  };

  const onDeleteActivities = async (activities: TActivity[]) => {
    Modal.confirm({
      getContainer: () =>
        document.getElementById('te-prefs-lib') || document.body,
      title: 'Delete reservations',
      content: 'Are you sure you want to cancel these reservations?',
      onOk: async () => {
        await handleDeleteActivities(activities);
        onDeselectAll();
      },
    });
  };

  const onSortActivities = (sorter: SorterResult<object>): void => {
    if (!sorter?.columnKey) return;
    sorter?.order
      ? dispatch(setActivitySorting(formId, sorter.columnKey, sorter.order))
      : dispatch(resetActivitySorting(formId));
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
          pre: SchedulingColumns(selectedRowKeys, isBeta),
          post: StaticColumns,
        }}
      />
    </>
  );
};

export default ActivitiesPage;
