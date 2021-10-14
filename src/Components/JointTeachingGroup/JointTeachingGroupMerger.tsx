import { Button } from 'antd';
import { TActivity } from 'Types/Activity.type';
import PropTypes from 'prop-types';
import { useState } from 'react';

import CreateNewJointTeachingGroupModal from 'Pages/FormDetail/pages/JointTeaching/JointTeachingModals/CreateNewJointTeachingGroupModal';

type Props = {
  activities: TActivity[];
  formId: string;
  onCreateMatchCallback: () => void;
};

const JointTeachingGroupMerger = ({
  activities = [],
  formId,
  onCreateMatchCallback,
}: Props) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button
        size='small'
        type='link'
        disabled={activities.length < 2}
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
        activities={activities}
      />
    </div>
  );
};

JointTeachingGroupMerger.propTypes = {
  activities: PropTypes.array,
};

export default JointTeachingGroupMerger;
