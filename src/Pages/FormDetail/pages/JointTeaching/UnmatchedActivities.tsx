import JointTeachingToolbar from 'Components/JointTeachingToolbar';
import React, { useState, Key, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import {
  selectUnmatchedActivities,
  makeSelectSortOrderForJointTeaching,
} from 'Redux/GlobalUI/globalUI.selectors';
import ActivityTable from '../ActivityTable';
import { JointTeachingColumn } from 'Components/ActivitiesTableColumns/JointTeachingTableColumns/JointTeachingColumns';
import { SorterResult } from 'antd/lib/table/interface';
import {
  setActivitySorting,
  resetActivitySorting,
} from 'Redux/GlobalUI/globalUI.actions';
import { TActivity } from 'Types/Activity.type';
import _ from 'lodash';

interface Props {
  formId: string;
}
const UnmatchedActivities = ({ formId }: Props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const dispatch = useDispatch();
  const design = useSelector(selectDesignForForm)(formId);

  const onSortActivities = (sorter: SorterResult<object>): void => {
    if (!sorter?.columnKey) return;
    sorter?.order
      ? dispatch(setActivitySorting(formId, sorter.columnKey, sorter.order))
      : dispatch(resetActivitySorting(formId));
  };

  const activities = useSelector(selectUnmatchedActivities(formId));

  const selectAll = () => {
    console.log('click');
  };

  const deselectAll = () => {
    console.log('click');
  };

  const createJointTeachingMatch = () => {
    console.log('createJointTeachingMatch');
  };

  const addJointTeachingMatch = () => {
    console.log('addJointTeachingMatch');
  };

  const selectJointTeachingSortingOrder = useMemo(
    () => makeSelectSortOrderForJointTeaching(),
    [],
  );
  const sortOrder = useSelector((state) =>
    selectJointTeachingSortingOrder(state, formId),
  );
  const allActivities = Object.values(activities).flat();
  const keyedActivities = _.keyBy(allActivities, '_id');

  const tableDataSource = useMemo(() => {
    const sortedActivities = _.compact<TActivity>(
      sortOrder?.map((activityId) => keyedActivities?.[activityId]),
    );
    return _.isEmpty(sortedActivities) ? allActivities : sortedActivities;
  }, [allActivities, keyedActivities, sortOrder]);

  return (
    <div>
      <JointTeachingToolbar
        tableType='jointTeachingUnmatchedActivities'
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
    </div>
  );
};

export default UnmatchedActivities;
