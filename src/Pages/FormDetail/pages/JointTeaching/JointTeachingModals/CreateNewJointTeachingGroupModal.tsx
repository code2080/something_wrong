import React from 'react';

import { Modal, ModalProps, Button } from 'antd';
import { TActivity } from 'Types/Activity.type';
import JointTeachingActivitiesTable from 'Components/ActivitiesTable/JointTeachingActivitiesTable';
import { useDispatch } from 'react-redux';

// ACTIONS
import { createJointTeachingGroup } from 'Redux/JointTeaching/jointTeaching.actions';

interface Props extends ModalProps {
  activities: TActivity[];
  formId: string;
}
const CreateNewJointTeachingGroupModal = (props: Props) => {
  const { visible, onCancel, activities, formId } = props;
  const dispatch = useDispatch();

  const onCreate = async (e) => {
    await dispatch(
      createJointTeachingGroup({
        formId,
        activityIds: activities.map(({ _id }) => _id),
      }),
    );
    if (typeof onCancel === 'function') {
      onCancel(e);
    }
  };
  const onCreateAndMerge = () => {};

  return (
    <Modal
      title='Create joint teaching match'
      visible={visible}
      onCancel={onCancel}
      footer={false}
      width={900}
    >
      <JointTeachingActivitiesTable
        showResult
        formId={formId}
        activities={activities}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={onCreate} type='primary'>
              Create
            </Button>
            &nbsp;&nbsp;
            <Button onClick={onCreateAndMerge} type='primary'>
              Create and merge
            </Button>
            &nbsp;&nbsp;
            <Button type='default' onClick={onCancel}>
              Cancel
            </Button>
          </div>
        }
      />
    </Modal>
  );
};

export default CreateNewJointTeachingGroupModal;
