/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { TeamOutlined } from '@ant-design/icons';

// COMPONENTS
import CreateNewJointTeachingGroupModal from 'Components/JointTeaching/CreateNewJointTeachingGroupModal';
import ToolbarButton from 'Components/Toolbars/Components/ToolbarButton';

type Props = {
  activityIds: string[];
  formId: string;
  onCreateMatchCallback: () => void;
};

const JointTeachingGroupMerger = ({
  activityIds = [],
  formId,
  onCreateMatchCallback,
}: Props) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <ToolbarButton
        disabled={activityIds.length < 2}
        onClick={() => setVisible(true)}
      >
        <TeamOutlined />
        Joint teaching match
      </ToolbarButton>
      <CreateNewJointTeachingGroupModal
        visible={visible}
        onCancel={(refetchNeeded?: boolean) => {
          setVisible(false);
          if (refetchNeeded) {
            onCreateMatchCallback();
          }
        }}
        activityIds={activityIds}
      />
    </>
  );
};

export default JointTeachingGroupMerger;
