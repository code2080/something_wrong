import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import { Modal } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import { selectIsBetaOrDev } from 'Redux/Auth/auth.selectors';
import { selectSelectedFilterValues } from 'Redux/Filters/filters.selectors';
import { createLoadingSelector } from '../../../Redux/APIStatus/apiStatus.selectors';
import { SchedulingColumns } from '../../../Components/ActivitiesTableColumns/SchedulingColumns/SchedulingColumns';
import { StaticColumns } from '../../../Components/ActivitiesTableColumns/StaticColumns/StaticColumns';

// COMPONENtS
import ActivitiesToolbar from '../../../Components/ActivitiesToolbar';
// ACTIONS
import {
  setActivitySorting,
  resetActivitySorting,
  selectActivitiesInTable,
} from '../../../Redux/GlobalUI/globalUI.actions';

// SELECTORS
import {
  makeSelectActivitiesForForm,
  makeSelectAllActivityIdsForForm,
} from '../../../Redux/Activities/activities.selectors';

// HELPERS

// HOOKS
import useActivityScheduling from '../../../Hooks/activityScheduling';
import { getExtIdsFromActivities } from '../../../Utils/ActivityValues/helpers';
import {
  makeSelectSortOrderForActivities,
  makeSelectSortParamsForActivities,
  makeSelectPaginationParamsForForm,
  selectSelectedActivities,
} from '../../../Redux/GlobalUI/globalUI.selectors';
import { TActivity } from '../../../Types/Activity.type';
import ActivityTable from './ActivityTable';
import { useActivitiesWatcher } from 'Hooks/useActivities';
import { ACTIVITIES_TABLE } from 'Constants/tables.constants';

const ActivitiesPage = () => {
  const dispatch = useDispatch();
  const isBeta = useSelector(selectIsBetaOrDev);
  const { formId } = useParams<{ formId: string }>();

  // For refecth activities
  const [fetchingTrigger, setFetchingTrigger] = useState(0);

  /**
   * SELECTORS
   */
  const selectedRowKeys = useSelector(
    selectSelectedActivities(ACTIVITIES_TABLE),
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

  const selectActivitiesForForm = useMemo(
    () => makeSelectActivitiesForForm(),
    [],
  );

  const activities = useSelector((state) =>
    selectActivitiesForForm(state, formId, ACTIVITIES_TABLE),
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
  const design = useSelector(selectDesignForForm)(formId);
  const selectAllActivityIdsForForm = useMemo(
    () => makeSelectAllActivityIdsForForm(),
    [],
  );

  const allActivityIds = useSelector((state) =>
    selectAllActivityIdsForForm(state, formId),
  );

  const isLoading = useSelector(
    createLoadingSelector(['FETCH_ACTIVITIES_FOR_FORM']),
  ) as boolean;

  /*
   * EVENT HANDLERS
   */
  const { handleScheduleActivities, handleDeleteActivities } =
    useActivityScheduling({
      formId,
      formType,
      reservationMode,
    });

  const handleSelectAll = () => {
    dispatch(selectActivitiesInTable(ACTIVITIES_TABLE, allActivityIds));
  };

  const onDeselectAll = () => {
    dispatch(selectActivitiesInTable(ACTIVITIES_TABLE, []));
  };

  const onScheduleActivities = async (activityIds: string[]) => {
    await handleScheduleActivities(activityIds);
    onDeselectAll();
  };

  const onDeleteActivities = async (activityIds: string[]) => {
    Modal.confirm({
      getContainer: () =>
        document.getElementById('te-prefs-lib') || document.body,
      title: 'Canncel reservations',
      content: 'Are you sure you want to cancel these reservations?',
      onOk: async () => {
        await handleDeleteActivities(activityIds);
        onDeselectAll();
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
      <ActivitiesToolbar
        selectedActivityIds={selectedRowKeys}
        onSelectAll={handleSelectAll}
        onDeselectAll={onDeselectAll}
        onScheduleActivities={onScheduleActivities}
        onDeleteActivities={onDeleteActivities}
        allActivities={allActivityIds}
        onCreateMatchCallback={() => {
          setFetchingTrigger(fetchingTrigger + 1);
        }}
      />
      <ActivityTable
        tableType={ACTIVITIES_TABLE}
        design={design}
        isLoading={isLoading}
        activities={tableDataSource}
        onSort={onSortActivities}
        additionalColumns={{
          pre: SchedulingColumns(selectedRowKeys, isBeta),
          post: StaticColumns,
        }}
        paginationParams={selectedPaginationParams}
        onSetCurrentPaginationParams={setCurrentPaginationParams}
      />
    </>
  );
};

export default ActivitiesPage;
