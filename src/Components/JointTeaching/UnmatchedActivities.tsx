import { useState } from 'react';
import JointTeachingToolbar from 'Components/JointTeachingToolbar';
import { useDispatch, useSelector } from 'react-redux';

// SELECTORS
import { selectSelectedActivities } from 'Redux/GlobalUI/globalUI.selectors';

// CONSTANTS
import { UNMATCHED_ACTIVITIES_TABLE } from 'Constants/tables.constants';
// ACTIONS
import { selectActivitiesInTable } from 'Redux/GlobalUI/globalUI.actions';
import CreateNewJointTeachingGroupModal from './CreateNewJointTeachingGroupModal';
import SelectJointTeachingGroupToAddActivitiesModal from './SelectJointTeachingGroupToAddActivitiesModal';
import { selectAllActivityIds } from 'Redux/DEPR_Activities/activities.selectors';
import { useParams } from 'react-router-dom';
import UnmatchedActivitiesTable from './UnmatchedActivitiesTable';
import ActivitiesToolbar from 'Components/ActivitiesToolbar';
import useSSP from 'Components/SSP/Utils/hooks';

interface Props {
  triggerFetchingActivities: number;
  setTriggerFetchingActivities: (trigger: number) => void;
}
const UnmatchedActivities = ({
  triggerFetchingActivities,
  setTriggerFetchingActivities,
}: Props) => {
  const [createNewGroupVisible, setCreateNewGroupVisible] = useState(false);
  const [selectJointTeachingGroupVisible, setSelectJointTeachingGroupVisible] =
    useState(false);
  const dispatch = useDispatch();
  const { selectedKeys, selectAllKeys, setSelectedKeys } = useSSP();

  /*   const allActivityIds = useSelector(selectAllActivityIds());

  const selectedRowKeys = useSelector(
    selectSelectedActivities(UNMATCHED_ACTIVITIES_TABLE),
  ); */

  const createJointTeachingMatch = () => {
    setCreateNewGroupVisible(true);
  };

  const addJointTeachingMatch = () => {
    setSelectJointTeachingGroupVisible(true);
  };

  const handleSelectAll = async () => {
    /*     dispatch(
      selectActivitiesInTable(UNMATCHED_ACTIVITIES_TABLE, allActivityIds),
    ); */
    selectAllKeys();
  };

  const handleDeselectAll = () => {
    // dispatch(selectActivitiesInTable(UNMATCHED_ACTIVITIES_TABLE, []));
    setSelectedKeys([]);
  };

  return (
    <div>
      {/* Todo: what is the diff between "JointTeachingToolbar" and "ActivitiesToolbar" */}
      {/*       <JointTeachingToolbar
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onCreateJointTeachingMatch={createJointTeachingMatch}
        onAddJointTeachingMatch={addJointTeachingMatch}
        selectedRowKeys={selectedRowKeys}
      /> */}
      <ActivitiesToolbar />
      {/* todo: might be able to remove this comp and just use activity table directly */}
      <UnmatchedActivitiesTable triggerFetching={triggerFetchingActivities} />
      <CreateNewJointTeachingGroupModal
        visible={createNewGroupVisible}
        onCancel={(refetchNeeded?: boolean) => {
          setCreateNewGroupVisible(false);
          handleDeselectAll();
          if (refetchNeeded) {
            setTriggerFetchingActivities(triggerFetchingActivities + 1);
          }
        }}
        // activityIds={selectedRowKeys}
        activityIds={selectedKeys}
      />
      <SelectJointTeachingGroupToAddActivitiesModal
        visible={selectJointTeachingGroupVisible}
        onCancel={(refetchNeeded?: boolean) => {
          if (refetchNeeded) {
            setTriggerFetchingActivities(triggerFetchingActivities + 1);
          }
          handleDeselectAll();
          setSelectJointTeachingGroupVisible(false);
        }}
        // selectedActivityIds={selectedRowKeys}
        selectedActivityIds={selectedKeys}
      />
    </div>
  );
};

export default UnmatchedActivities;
