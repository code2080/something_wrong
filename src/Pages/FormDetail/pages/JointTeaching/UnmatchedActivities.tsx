import JointTeachingToolbar from 'Components/JointTeachingToolbar';
import React, { useState, Key, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import {
  makeSelectSortOrderForActivities,
  makeSelectSortParamsForActivities,
} from 'Redux/GlobalUI/globalUI.selectors';
import { JointTeachingColumn } from 'Components/ActivitiesTableColumns/JointTeachingTableColumns/JointTeachingColumns';
import { SorterResult } from 'antd/lib/table/interface';
import {
  setActivitySorting,
  resetActivitySorting,
} from 'Redux/GlobalUI/globalUI.actions';
import { TActivity } from 'Types/Activity.type';
import _ from 'lodash';
import ActivityTable from '../ActivityTable';
import CreateNewJointTeachingGroupModal from './JointTeachingModals/CreateNewJointTeachingGroupModal';
import { useActivitiesWatcher } from 'Hooks/useActivities';
import { selectSelectedFilterValues } from 'Redux/Filters/filters.selectors';
import { UNMATCHED_ACTIVITIES_TABLE } from 'Constants/tables.constants';
import { selectActivitiesForForm } from 'Redux/Activities/activities.selectors';

interface Props {
  formId: string;
}
const UnmatchedActivities = ({ formId }: Props) => {
  const [createNewGroupVisible, setCreateNewGroupVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const dispatch = useDispatch();
  const design = useSelector(selectDesignForForm)(formId);

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
  useActivitiesWatcher({
    formId,
    filters: selectedFilterValues,
    sorters: selectedSortingParams,
    origin: UNMATCHED_ACTIVITIES_TABLE,
  });

  const activities = useSelector(
    selectActivitiesForForm({ formId, tableType: UNMATCHED_ACTIVITIES_TABLE }),
  );

  const selectAll = () => {
    console.log('click');
  };

  const deselectAll = () => {
    console.log('click');
  };

  const createJointTeachingMatch = () => {
    setCreateNewGroupVisible(true);
  };

  const addJointTeachingMatch = () => {
    console.log('addJointTeachingMatch');
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

  return (
    <div>
      <JointTeachingToolbar
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onCreateJointTeachingMatch={createJointTeachingMatch}
        onAddJointTeachingMatch={addJointTeachingMatch}
        selectedRowKeys={selectedRowKeys}
      />
      <ActivityTable
        design={design}
        // isLoading={isLoading}
        activities={tableDataSource}
        onSort={onSortActivities}
        selectedActivities={selectedRowKeys}
        onSelect={setSelectedRowKeys}
        additionalColumns={{
          pre: JointTeachingColumn(),
        }}
      />
      <CreateNewJointTeachingGroupModal
        visible={createNewGroupVisible}
        onCancel={() => {
          setCreateNewGroupVisible(false);
          setSelectedRowKeys([]);
        }}
        formId={formId}
        activities={activities.filter(({ _id }) =>
          selectedRowKeys.includes(_id),
        )}
      />
    </div>
  );
};

export default UnmatchedActivities;
