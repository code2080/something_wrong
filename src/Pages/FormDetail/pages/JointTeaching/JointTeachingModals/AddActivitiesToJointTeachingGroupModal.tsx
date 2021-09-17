import React, { useState, useEffect, Key } from 'react';
import Modal, { ModalProps } from 'antd/lib/modal/Modal';
import JointTeachingActivitiesTable from 'Components/ActivitiesTable/JointTeachingActivitiesTable';
import { TActivity } from 'Types/Activity.type';

interface Props extends ModalProps {
  formId: string;
  activities: TActivity[];
  onSubmit?: (activityIds: Key[]) => void;
}
const AddActivitiesToJointTeachingGroupModal = (props: Props) => {
  const { visible, onCancel, formId, activities, onSubmit } = props;

  const [selectedActivities, setSelectedActivities] = useState<Key[]>([]);

  useEffect(() => {
    if (!visible) {
      setSelectedActivities([]);
    }
  }, [visible]);

  return (
    <Modal
      width={900}
      visible={visible}
      onCancel={onCancel}
      title='Add activities to joint teaching'
      getContainer={() =>
        document.getElementById('te-prefs-lib') || document.body
      }
      destroyOnClose
      okText='Add selection'
      onOk={(e) => {
        if (typeof onSubmit === 'function') onSubmit(selectedActivities);
        if (typeof onCancel === 'function') onCancel(e);
      }}
      okButtonProps={{
        disabled: !selectedActivities.length,
      }}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}
    >
      <JointTeachingActivitiesTable
        readonly
        formId={formId}
        activities={activities}
        selectedActivities={selectedActivities}
        onSelect={(activityIds) => setSelectedActivities(activityIds)}
      />
    </Modal>
  );
};

export default AddActivitiesToJointTeachingGroupModal;
