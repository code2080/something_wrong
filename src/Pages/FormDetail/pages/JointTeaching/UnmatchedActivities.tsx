import { useState } from 'react';
import JointTeachingToolbar from 'Components/JointTeachingToolbar';
import { useDispatch, useSelector } from 'react-redux';

// SELECTORS
import { selectSelectedActivities } from 'Redux/GlobalUI/globalUI.selectors';

// CONSTANTS
import { UNMATCHED_ACTIVITIES_TABLE } from 'Constants/tables.constants';
// ACTIONS
import { selectActivitiesInTable } from 'Redux/GlobalUI/globalUI.actions';
import CreateNewJointTeachingGroupModal from './JointTeachingModals/CreateNewJointTeachingGroupModal';
import SelectJointTeachingGroupToAddActivitiesModal from './JointTeachingModals/SelectJointTeachingGroupToAddActivitiesModal';
import UnmatchedActivitiesTable from './Components/UnmatchedActivitiesTable';
import { selectAllActivityIds } from 'Redux/Activities/activities.selectors';

interface Props {
  formId: string;
  triggerFetchingActivities: number;
  setTriggerFetchingActivities: (trigger: number) => void;
}
const UnmatchedActivities = (props: Props) => {
  const { formId, triggerFetchingActivities, setTriggerFetchingActivities } =
    props;
  const [createNewGroupVisible, setCreateNewGroupVisible] = useState(false);
  const [selectJointTeachingGroupVisible, setSelectJointTeachingGroupVisible] =
    useState(false);
  const dispatch = useDispatch();

  const allActivityIds = useSelector(selectAllActivityIds());

  const selectedRowKeys = useSelector(
    selectSelectedActivities(UNMATCHED_ACTIVITIES_TABLE),
  );

  const createJointTeachingMatch = () => {
    setCreateNewGroupVisible(true);
  };

  const addJointTeachingMatch = () => {
    setSelectJointTeachingGroupVisible(true);
  };

  const handleSelectAll = async () => {
    dispatch(
      selectActivitiesInTable(UNMATCHED_ACTIVITIES_TABLE, allActivityIds),
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
        activityIds={selectedRowKeys}
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
