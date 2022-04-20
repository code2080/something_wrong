/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-pattern */
import { useState } from 'react';
import JointTeachingToolbar from 'Components/JointTeachingToolbar';

// ACTIONS
import CreateNewJointTeachingGroupModal from './CreateNewJointTeachingGroupModal';
import SelectJointTeachingGroupToAddActivitiesModal from './SelectJointTeachingGroupToAddActivitiesModal';
import UnmatchedActivitiesTable from './UnmatchedActivitiesTable';
import useSSP from 'Components/SSP/Utils/hooks';

interface Props {}
const UnmatchedActivities = ({}: Props) => {
  const [createNewGroupVisible, setCreateNewGroupVisible] = useState(false);
  const [selectJointTeachingGroupVisible, setSelectJointTeachingGroupVisible] =
    useState(false);
  const { selectedKeys, selectAllKeys, setSelectedKeys } = useSSP();

  const createJointTeachingMatch = () => {
    setCreateNewGroupVisible(true);
  };

  const addJointTeachingMatch = () => {
    setSelectJointTeachingGroupVisible(true);
  };

  const handleSelectAll = async () => {
    selectAllKeys();
  };

  const handleDeselectAll = () => {
    setSelectedKeys([]);
  };

  return (
    <div>
      {/* Todo: what is the diff between "JointTeachingToolbar" and "ActivitiesToolbar" */}
      {/* Ans: buttons that toggles modals and more it seems */}
      <JointTeachingToolbar
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onCreateJointTeachingMatch={createJointTeachingMatch}
        onAddJointTeachingMatch={addJointTeachingMatch}
        selectedRowKeys={selectedKeys}
      />
      {/* <ActivitiesToolbar /> */}
      {/* todo: might be able to remove this comp and just use activity table directly */}
      <UnmatchedActivitiesTable />
      <CreateNewJointTeachingGroupModal
        visible={createNewGroupVisible}
        onCancel={(refetchNeeded?: boolean) => {
          setCreateNewGroupVisible(false);
          handleDeselectAll();
          /*           if (refetchNeeded) {
            setTriggerFetchingActivities(triggerFetchingActivities + 1);
          } */
        }}
        // activityIds={selectedRowKeys}
        activityIds={selectedKeys}
      />
      <SelectJointTeachingGroupToAddActivitiesModal
        visible={selectJointTeachingGroupVisible}
        onCancel={(refetchNeeded?: boolean) => {
          /*           if (refetchNeeded) {
            setTriggerFetchingActivities(triggerFetchingActivities + 1);
          } */
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
