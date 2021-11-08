import { Button } from 'antd';
import PropTypes from 'prop-types';
import { useState } from 'react';

import CreateNewJointTeachingGroupModal from 'Pages/FormDetail/pages/JointTeaching/JointTeachingModals/CreateNewJointTeachingGroupModal';

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
    <div>
      <Button
        size='small'
        type='link'
        disabled={activityIds.length < 2}
        onClick={() => setVisible(true)}
      >
        Create joint teaching match
      </Button>
      <CreateNewJointTeachingGroupModal
        visible={visible}
        onCancel={(refetchNeeded?: boolean) => {
          setVisible(false);
          console.log(refetchNeeded);
          if (refetchNeeded) {
            onCreateMatchCallback();
          }
        }}
        formId={formId}
        activityIds={activityIds}
      />
    </div>
  );
};

JointTeachingGroupMerger.propTypes = {
  activities: PropTypes.array,
};

export default JointTeachingGroupMerger;
