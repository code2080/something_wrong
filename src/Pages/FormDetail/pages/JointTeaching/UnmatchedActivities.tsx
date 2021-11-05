import React, { useState, useMemo } from 'react';
import _ from 'lodash';
import JointTeachingToolbar from 'Components/JointTeachingToolbar';
import { useDispatch, useSelector } from 'react-redux';

// SELECTORS
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import {
  makeSelectPaginationParamsForForm,
  makeSelectSortOrderForActivities,
  makeSelectSortParamsForActivities,
  selectSelectedActivities,
} from 'Redux/GlobalUI/globalUI.selectors';
import { selectActivitiesForForm } from 'Redux/Activities/activities.selectors';
import { selectSelectedFilterValues } from 'Redux/Filters/filters.selectors';
import { createLoadingSelector } from 'Redux/APIStatus/apiStatus.selectors';

// COMPONNETS
import { JointTeachingColumn } from 'Components/ActivitiesTableColumns/JointTeachingTableColumns/JointTeachingColumns';
import { TActivity } from 'Types/Activity.type';

// CONSTANTS
import { SorterResult } from 'antd/lib/table/interface';
import { UNMATCHED_ACTIVITIES_TABLE } from 'Constants/tables.constants';
import { FETCH_ACTIVITIES_FOR_FORM } from 'Redux/Activities/activities.actionTypes';
// ACTIONS
import {
  setActivitySorting,
  resetActivitySorting,
  selectActivitiesInTable,
} from 'Redux/GlobalUI/globalUI.actions';
import ActivityTable from '../ActivityTable';
import CreateNewJointTeachingGroupModal from './JointTeachingModals/CreateNewJointTeachingGroupModal';
import { useActivitiesWatcher } from 'Hooks/useActivities';
import SelectJointTeachingGroupToAddActivitiesModal from './JointTeachingModals/SelectJointTeachingGroupToAddActivitiesModal';

interface Props {
  formId: string;
}
const UnmatchedActivities = ({ formId }: Props) => {
  const [createNewGroupVisible, setCreateNewGroupVisible] = useState(false);
  const [selectJointTeachingGroupVisible, setSelectJointTeachingGroupVisible] =
    useState(false);
  const [triggerFetchingActivities, setTriggerFetchingActivities] = useState(0);
  const dispatch = useDispatch();
  const design = useSelector(selectDesignForForm)(formId);
  const isLoading = useSelector(
    createLoadingSelector([FETCH_ACTIVITIES_FOR_FORM]),
  );

  const selectedActivities = useSelector(
    selectSelectedActivities(UNMATCHED_ACTIVITIES_TABLE),
  );
  const selectedRowKeys = useMemo(() => {
    return selectedActivities.map(({ _id }) => _id);
  }, [selectedActivities]);

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
    makeSelectPaginationParamsForForm()(state, formId),
  );

  const { setCurrentPaginationParams } = useActivitiesWatcher({
    formId,
    filters: selectedFilterValues,
    sorters: selectedSortingParams,
    origin: UNMATCHED_ACTIVITIES_TABLE,
    pagination: selectedPaginationParams,
    trigger: triggerFetchingActivities,
  });

  const activities = useSelector(
    selectActivitiesForForm({ formId, tableType: UNMATCHED_ACTIVITIES_TABLE }),
  );

  const createJointTeachingMatch = () => {
    setCreateNewGroupVisible(true);
  };

  const addJointTeachingMatch = () => {
    setSelectJointTeachingGroupVisible(true);
  };

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

  const handleSelectAll = () => {
    dispatch(
      selectActivitiesInTable(UNMATCHED_ACTIVITIES_TABLE, tableDataSource),
    );
  };

  const handleDeselectAll = () => {
    dispatch(selectActivitiesInTable(UNMATCHED_ACTIVITIES_TABLE, []));
  };

  return (
    <div>
      <JointTeachingToolbar
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onCreateJointTeachingMatch={createJointTeachingMatch}
        onAddJointTeachingMatch={addJointTeachingMatch}
        selectedRowKeys={selectedRowKeys}
      />
      <ActivityTable
        design={design}
        tableType={UNMATCHED_ACTIVITIES_TABLE}
        isLoading={!!isLoading}
        activities={tableDataSource}
        onSort={onSortActivities}
        selectedActivities={selectedRowKeys}
        additionalColumns={{
          pre: JointTeachingColumn(),
        }}
        onSetCurrentPaginationParams={setCurrentPaginationParams}
      />
      <CreateNewJointTeachingGroupModal
        visible={createNewGroupVisible}
        onCancel={(refetchNeeded?: boolean) => {
          setCreateNewGroupVisible(false);
          handleDeselectAll();
          if (refetchNeeded) {
            setTriggerFetchingActivities(triggerFetchingActivities + 1);
          }
        }}
        formId={formId}
        activities={activities.filter(({ _id }) =>
          selectedRowKeys.includes(_id),
        )}
      />
      <SelectJointTeachingGroupToAddActivitiesModal
        formId={formId}
        visible={selectJointTeachingGroupVisible}
        onCancel={(refetchNeeded?: boolean) => {
          if (refetchNeeded) {
            setTriggerFetchingActivities(triggerFetchingActivities + 1);
          }
          handleDeselectAll();
          setSelectJointTeachingGroupVisible(false);
        }}
        selectedActivityIds={selectedRowKeys}
      />
    </div>
  );
};

export default UnmatchedActivities;
