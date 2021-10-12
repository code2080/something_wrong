import React, { useEffect, useState } from 'react';

import { Modal, ModalProps, Button } from 'antd';
import { TActivity } from 'Types/Activity.type';
import JointTeachingActivitiesTable from 'Components/ActivitiesTable/JointTeachingActivitiesTable';
import { useDispatch, useSelector } from 'react-redux';

// ACTIONS
import { createJointTeachingGroup } from 'Redux/JointTeaching/jointTeaching.actions';

// SELETORS
import { createLoadingSelector } from 'Redux/APIStatus/apiStatus.selectors';
import { CALCULATE_JOINT_TEACHING_MATCHING_SCORE } from 'Redux/JointTeaching/jointTeaching.actionTypes';
import { useJointTeachingCalculating } from 'Hooks/jointTeaching';

interface Props extends Omit<ModalProps, 'onCancel'> {
  activities: TActivity[];
  formId: string;
  onCancel: (refetchNeeded?: boolean) => void;
}
const CreateNewJointTeachingGroupModal = (props: Props) => {
  const { visible, onCancel, activities, formId } = props;
  const [canBePaired, setCanBePaired] = useState(false);
  const calculating = useSelector(
    createLoadingSelector([CALCULATE_JOINT_TEACHING_MATCHING_SCORE]),
  );
  const dispatch = useDispatch();

  const jointTeachingCalculating = useJointTeachingCalculating({ formId });

  useEffect(() => {
    const doCalculating = async () => {
      const canBePaired = await jointTeachingCalculating.activitiesCanBePaired(
        activities.map(({ _id }) => _id),
      );
      setCanBePaired(canBePaired);
    };
    if (visible) {
      doCalculating();
    }
  }, [visible]);

  const doCreate = async () => {
    await dispatch(
      createJointTeachingGroup({
        formId,
        activityIds: activities.map(({ _id }) => _id),
      }),
    );
    if (typeof onCancel === 'function') {
      onCancel(true);
    }
  };
  const onCreate = () => {
    jointTeachingCalculating.addActivitiesToJointTeachingMatchRequest({
      canBePaired,
      onSubmit: doCreate,
    });
  };
  const onCreateAndMerge = () => {};

  return (
    <Modal
      title='Create joint teaching match'
      visible={visible}
      onCancel={() => onCancel()}
      footer={false}
      width={900}
    >
      <JointTeachingActivitiesTable
        loading={!!calculating}
        showResult
        formId={formId}
        activities={activities}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={onCreate} type='primary'>
              Create
            </Button>
            &nbsp;&nbsp;
            <Button
              onClick={onCreateAndMerge}
              type='primary'
              disabled={!canBePaired}
            >
              Create and merge
            </Button>
            &nbsp;&nbsp;
            <Button type='default' onClick={() => onCancel()}>
              Cancel
            </Button>
          </div>
        }
      />
    </Modal>
  );
};

export default CreateNewJointTeachingGroupModal;
