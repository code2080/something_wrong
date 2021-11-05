import React, { useState, useEffect, Key } from 'react';
import { Modal, ModalProps } from 'antd';
import { useSelector } from 'react-redux';

// COMPONENTS
import JointTeachingActivitiesTable from 'Components/ActivitiesTable/JointTeachingActivitiesTable';

// TYPES
import { TActivity } from 'Types/Activity.type';

// SELECTORS
import { selectJointTeachingGroupById } from 'Redux/JointTeaching/jointTeaching.selectors';
import { useJointTeachingCalculating } from 'Hooks/jointTeaching';
import { UNMATCHED_ACTIVITIES_TABLE } from 'Constants/tables.constants';

interface Props extends ModalProps {
  formId: string;
  activities: TActivity[];
  jointTeachingGroupId?: string;
  onSubmit?: (activityIds: Key[]) => void;
}
const AddActivitiesToJointTeachingGroupModal = (props: Props) => {
  const {
    visible,
    onCancel,
    formId,
    jointTeachingGroupId,
    activities,
    onSubmit,
  } = props;
  const jointTeachingGroup = useSelector(
    selectJointTeachingGroupById({ formId, jointTeachingGroupId }),
  );
  const jointTeachingCalculating = useJointTeachingCalculating({ formId });
  const [selectedActivities, setSelectedActivities] = useState<Key[]>([]);

  const doSubmit = (e) => {
    if (typeof onSubmit === 'function') onSubmit(selectedActivities);
    if (typeof onCancel === 'function') onCancel(e);
  };
  const onOk = async (e) => {
    const canBePaired = await jointTeachingCalculating.activitiesCanBePaired([
      ...selectedActivities,
      ...(jointTeachingGroup?.activityIds || []),
    ]);
    jointTeachingCalculating.addActivitiesToJointTeachingMatchRequest({
      canBePaired,
      onSubmit: () => doSubmit(e),
    });
  };

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
      onOk={onOk}
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
        selectable={false}
        formId={formId}
        activities={activities}
        selectedActivities={selectedActivities}
        onSelect={(activityIds) => setSelectedActivities(activityIds)}
      />
    </Modal>
  );
};

export default AddActivitiesToJointTeachingGroupModal;
