import _ from 'lodash';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// SELECTORS
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import {
  makeSelectPaginationParamsForForm,
  makeSelectSortOrderForActivities,
  makeSelectSortParamsForActivities,
  selectSelectedActivities,
} from 'Redux/GlobalUI/globalUI.selectors';
import { selectActivitiesForForm } from 'Redux/DEPR_Activities/activities.selectors';
import { selectSelectedFilterValues } from 'Redux/Filters/filters.selectors';
import { createLoadingSelector } from 'Redux/APIStatus/apiStatus.selectors';

// COMPONNETS
import { JointTeachingColumn } from 'Components/DEPR_ActivitiesTableColumns/JointTeachingTableColumns/JointTeachingColumns';
import { TActivity } from 'Types/Activity/Activity.type';

// CONSTANTS
import { SorterResult } from 'antd/lib/table/interface';
import { UNMATCHED_ACTIVITIES_TABLE } from 'Constants/tables.constants';
import { FETCH_ACTIVITIES_FOR_FORM } from 'Redux/DEPR_Activities/activities.actionTypes';
// ACTIONS
import {
  setActivitySorting,
  resetActivitySorting,
} from 'Redux/GlobalUI/globalUI.actions';
import ActivityTable from '../../Activities/DEPR_ActivityTable';
import { useActivitiesWatcher } from 'Hooks/useActivities';

interface Props {
  formId: string;
  triggerFetching: number;
}
const UnmatchedActivitiesTable = ({ formId, triggerFetching }: Props) => {
  const dispatch = useDispatch();
  const design = useSelector(selectDesignForForm)(formId);
  const isLoading = useSelector(
    createLoadingSelector([FETCH_ACTIVITIES_FOR_FORM]),
  );

  const selectedActivityIds = useSelector(
    selectSelectedActivities(UNMATCHED_ACTIVITIES_TABLE),
  );

  const onSortActivities = (sorter: SorterResult<object>): void => {
    if (!sorter?.columnKey) return;
    sorter?.order
      ? dispatch(
          setActivitySorting(
            formId,
            sorter.columnKey,
            sorter.order,
            UNMATCHED_ACTIVITIES_TABLE,
          ),
        )
      : dispatch(resetActivitySorting(formId, UNMATCHED_ACTIVITIES_TABLE));
  };

  const selectedFilterValues = useSelector(
    selectSelectedFilterValues({ formId, origin: UNMATCHED_ACTIVITIES_TABLE }),
  );
  const selectedSortingParams = useSelector((state) =>
    makeSelectSortParamsForActivities(UNMATCHED_ACTIVITIES_TABLE)(
      state,
      formId,
    ),
  );

  const selectedPaginationParams = useSelector((state) =>
    makeSelectPaginationParamsForForm()(
      state,
      formId,
      UNMATCHED_ACTIVITIES_TABLE,
    ),
  );

  const { setCurrentPaginationParams } = useActivitiesWatcher({
    formId,
    filters: {
      ...selectedFilterValues,
      'settings.jointTeaching': 'ONLY',
    },
    sorters: selectedSortingParams,
    origin: UNMATCHED_ACTIVITIES_TABLE,
    pagination: selectedPaginationParams,
    trigger: triggerFetching,
  });

  const activities = useSelector(
    selectActivitiesForForm({ formId, tableType: UNMATCHED_ACTIVITIES_TABLE }),
  );

  const selectJointTeachingSortingOrder = useMemo(
    () => makeSelectSortOrderForActivities(UNMATCHED_ACTIVITIES_TABLE),
    [],
  );
  const sortOrder = useSelector((state) =>
    selectJointTeachingSortingOrder(state, formId),
  );
  const keyedActivities = _.keyBy(activities, '_id');

  const tableDataSource = useMemo(() => {
    const sortedActivities = _.compact<TActivity>(
      sortOrder?.map((activityId) => keyedActivities?.[activityId]),
    );
    return _.isEmpty(sortedActivities) ? activities : sortedActivities;
  }, [activities, keyedActivities, sortOrder]);

  return (
    <ActivityTable
      design={design}
      tableType={UNMATCHED_ACTIVITIES_TABLE}
      isLoading={!!isLoading}
      activities={tableDataSource}
      onSort={onSortActivities}
      selectedActivities={selectedActivityIds}
      additionalColumns={{
        pre: JointTeachingColumn(),
      }}
      paginationParams={selectedPaginationParams}
      onSetCurrentPaginationParams={setCurrentPaginationParams}
    />
  );
};

export default UnmatchedActivitiesTable;
