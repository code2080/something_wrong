import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import { Modal } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import { selectSelectedFilterValues } from 'Redux/Filters/filters.selectors';
import { createLoadingSelector } from '../../../../Redux/APIStatus/apiStatus.selectors';
import { SchedulingColumns } from '../../../../Components/DEPR_ActivitiesTableColumns/SchedulingColumns/SchedulingColumns';
import { StaticColumns } from '../../../../Components/DEPR_ActivitiesTableColumns/StaticColumns/StaticColumns';
import HasActivityInWorkerProgress from '../../../../Components/ActivityDesigner/HasActivityInWorkerProgress';

// COMPONENTS
import ActivitiesToolbar from '../../../../Components/ActivitiesToolbar';
import ActivityTable from './DEPR_ActivityTable';

// ACTIONS
import {
  setActivitySorting,
  resetActivitySorting,
  selectActivitiesInTable,
  forceFetchingActivities,
} from '../../../../Redux/GlobalUI/globalUI.actions';

// SELECTORS
import {
  makeSelectFilteredActivityIdsForForm,
  selectActivitiesForForm,
  activityInWorkerProgressSelector,
  selectAllActivityIds,
} from '../../../../Redux/DEPR_Activities/activities.selectors';

// HELPERS

// HOOKS
import useActivityScheduling from '../../../../Hooks/activityScheduling';
import {
  makeSelectSortOrderForActivities,
  makeSelectSortParamsForActivities,
  makeSelectPaginationParamsForForm,
  selectSelectedActivities,
  selectActivitiesFetchingHandler,
} from '../../../../Redux/GlobalUI/globalUI.selectors';
import { useActivitiesWatcher } from 'Hooks/useActivities';

// TYPES
import { TActivity } from '../../../../Types/Activity/Activity.type';
import { ACTIVITIES_TABLE } from 'Constants/tables.constants';

const ActivitiesPage = () => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();

  /**
   * SELECTORS
   */
  const selectedRowKeys = useSelector(
    selectSelectedActivities(ACTIVITIES_TABLE),
  );

  const fetchingTrigger = useSelector(
    selectActivitiesFetchingHandler(ACTIVITIES_TABLE),
  );

  // Select filters
  const selectedFilterValues = useSelector(
    selectSelectedFilterValues({ formId, origin: ACTIVITIES_TABLE }),
  );

  // Select sorting
  const selectActivityParamSorting = useMemo(
    () => makeSelectSortParamsForActivities(ACTIVITIES_TABLE),
    [],
  );

  const selectedSortingParams = useSelector((state) =>
    selectActivityParamSorting(state, formId),
  );

  const activities = useSelector(
    selectActivitiesForForm({ formId, tableType: ACTIVITIES_TABLE }),
  );

  const selectPaginationParamsForForm = useMemo(
    () => makeSelectPaginationParamsForForm(),
    [],
  );

  const selectedPaginationParams = useSelector((state) =>
    selectPaginationParamsForForm(state, formId, ACTIVITIES_TABLE),
  );

  const allActivities = Object.values(activities).flat();
  const keyedActivities = _.keyBy(allActivities, '_id');

  const selectActivitySortingOrder = useMemo(
    () => makeSelectSortOrderForActivities(ACTIVITIES_TABLE),
    [],
  );
  const sortOrder = useSelector((state) =>
    selectActivitySortingOrder(state, formId),
  );

  const hasActivitiesInProgress = useSelector(activityInWorkerProgressSelector)(
    formId,
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

  /**
   * HOOKS
   */
  const { setCurrentPaginationParams } = useActivitiesWatcher({
    formId,
    filters: selectedFilterValues,
    sorters: selectedSortingParams,
    origin: ACTIVITIES_TABLE,
    pagination: selectedPaginationParams,
    trigger: fetchingTrigger,
  });

  const allActivityIds = useSelector(selectAllActivityIds());

  const design = useSelector(selectDesignForForm)(formId);
  const selectFilteredActivityIdsForForm = useMemo(
    () => makeSelectFilteredActivityIdsForForm(),
    [],
  );

  const filteredActivityIds = useSelector((state) =>
    selectFilteredActivityIdsForForm(state, formId),
  );

  const isLoading = useSelector(
    createLoadingSelector(['FETCH_ACTIVITIES_FOR_FORM']),
  ) as boolean;

  /*
   * EVENT HANDLERS
   */
  const {
    handleScheduleActivities,
    handleCancelReservations,
    handleScheduleActivitiesByFormInstanceId,
    handleCancelReservationsByFormInstanceId,
  } = useActivityScheduling({
    formId,
    formType,
    reservationMode,
  });

  const onDeselectAll = () => {
    dispatch(selectActivitiesInTable(ACTIVITIES_TABLE, []));
  };

  const doFetchingActivities = () => {
    dispatch(forceFetchingActivities(ACTIVITIES_TABLE));
  };

  const onScheduleActivities = async (activityIds: string[]) => {
    await handleScheduleActivities(activityIds);
    onDeselectAll();
  };

  const onScheduleActivitiesByFormInstanceId = async (
    formInstanceId: string,
  ) => {
    await handleScheduleActivitiesByFormInstanceId(formInstanceId);
    onDeselectAll();
  };

  const onScheduleAllActivities = async () => {
    if (allActivityIds) {
      await onScheduleActivities(allActivityIds);
    }
  };

  const onDeleteActivities = async (activityIds: string[]) => {
    Modal.confirm({
      getContainer: () =>
        document.getElementById('te-prefs-lib') || document.body,
      title: 'Cancel reservations',
      content: 'Are you sure you want to cancel these reservations?',
      onOk: async () => {
        await handleCancelReservations(activityIds);
        doFetchingActivities();
        onDeselectAll();
      },
    });
  };

  const onDeleteActivitiesByFormInstanceId = async (formInstanceId: string) => {
    Modal.confirm({
      getContainer: () =>
        document.getElementById('te-prefs-lib') || document.body,
      title: 'Cancel reservations',
      content: 'Are you sure you want to cancel these reservations?',
      onOk: async () => {
        await handleCancelReservationsByFormInstanceId(formInstanceId);
        doFetchingActivities();
      },
    });
  };

  const onSortActivities = (sorter: SorterResult<object>): void => {
    if (!sorter?.columnKey) return;
    sorter?.order
      ? dispatch(
          setActivitySorting(
            formId,
            sorter.columnKey,
            sorter.order,
            ACTIVITIES_TABLE,
          ),
        )
      : dispatch(resetActivitySorting(formId, ACTIVITIES_TABLE));
  };

  return (
    <>
      <ActivitiesToolbar />
      {hasActivitiesInProgress && <HasActivityInWorkerProgress />}
      <ActivityTable
        tableType={ACTIVITIES_TABLE}
        design={design}
        isLoading={isLoading}
        activities={tableDataSource}
        onSort={onSortActivities}
        additionalColumns={{
          pre: SchedulingColumns(selectedRowKeys, {
            onDelete: onDeleteActivities,
            onDeleteByFormInstanceId: onDeleteActivitiesByFormInstanceId,
            onSchedule: onScheduleActivities,
            onScheduleByFormInstanceId: onScheduleActivitiesByFormInstanceId,
          }),
          post: StaticColumns,
        }}
        paginationParams={selectedPaginationParams}
        onSetCurrentPaginationParams={setCurrentPaginationParams}
      />
    </>
  );
};

export default ActivitiesPage;
