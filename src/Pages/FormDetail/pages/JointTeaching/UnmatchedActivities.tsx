import React, { useState, useMemo } from 'react';
import _ from 'lodash';
import JointTeachingToolbar from 'Components/JointTeachingToolbar';
import { useDispatch, useSelector } from 'react-redux';

// SELECTORS
import {
  makeSelectSortOrderForActivities,
  selectSelectedActivities,
} from 'Redux/GlobalUI/globalUI.selectors';
import { selectActivitiesForForm } from 'Redux/Activities/activities.selectors';

// COMPONNETS
import { TActivity } from 'Types/Activity.type';

// CONSTANTS
import { UNMATCHED_ACTIVITIES_TABLE } from 'Constants/tables.constants';
// ACTIONS
import { selectActivitiesInTable } from 'Redux/GlobalUI/globalUI.actions';
import CreateNewJointTeachingGroupModal from './JointTeachingModals/CreateNewJointTeachingGroupModal';
import SelectJointTeachingGroupToAddActivitiesModal from './JointTeachingModals/SelectJointTeachingGroupToAddActivitiesModal';
import UnmatchedActivitiesTable from './Components/UnmatchedActivitiesTable';

interface Props {
  formId: string;
}
const UnmatchedActivities = ({ formId }: Props) => {
  const [createNewGroupVisible, setCreateNewGroupVisible] = useState(false);
  const [selectJointTeachingGroupVisible, setSelectJointTeachingGroupVisible] =
    useState(false);
  const [triggerFetchingActivities, setTriggerFetchingActivities] = useState(0);
  const dispatch = useDispatch();

  const selectedRowKeys = useSelector(
    selectSelectedActivities(UNMATCHED_ACTIVITIES_TABLE),
  );

  // TODO: Should be removed later
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
      <UnmatchedActivitiesTable
        formId={formId}
        triggerFetching={triggerFetchingActivities}
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
        activities={selectedActivities}
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
