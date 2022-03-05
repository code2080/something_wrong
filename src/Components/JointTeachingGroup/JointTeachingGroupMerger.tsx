import { useState } from 'react';
import { TeamOutlined } from '@ant-design/icons';

// COMPONENTS
import CreateNewJointTeachingGroupModal from 'Pages/FormDetail/pages/JointTeaching/JointTeachingModals/CreateNewJointTeachingGroupModal';
import ToolbarButton from 'Components/ActivitiesToolbar/ToolbarButton';

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
        formId={formId}
        activityIds={activityIds}
      />
    </>
  );
};

export default JointTeachingGroupMerger;
