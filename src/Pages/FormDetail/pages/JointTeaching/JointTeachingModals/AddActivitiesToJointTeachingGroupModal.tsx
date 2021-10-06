import React, { useState, useEffect, Key } from 'react';
import { Modal, ModalProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

// COMPONENTS
import JointTeachingActivitiesTable from 'Components/ActivitiesTable/JointTeachingActivitiesTable';

// TYPES
import { TActivity } from 'Types/Activity.type';

// ACTIONS
import { calculateJointTeachingMatchingScore } from 'Redux/JointTeaching/jointTeaching.actions';

// SELECTORS
import { selectJointTeachingGroupById } from 'Redux/JointTeaching/jointTeaching.selectors';

interface Props extends ModalProps {
  formId: string;
  activities: TActivity[];
  jointTeachingGroupId?: string;
  onSubmit?: (activityIds: Key[]) => void;
}
const AddActivitiesToJointTeachingGroupModal = (props: Props) => {
  const dispatch = useDispatch();
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
  const [selectedActivities, setSelectedActivities] = useState<Key[]>([]);

  const doSubmit = (e) => {
    if (typeof onSubmit === 'function') onSubmit(selectedActivities);
    if (typeof onCancel === 'function') onCancel(e);
  };
  const onOk = async (e) => {
    const res = dispatch(
      calculateJointTeachingMatchingScore({
        formId,
        activityIds: [
          ...selectedActivities,
          ...(jointTeachingGroup?.activityIds || []),
        ],
      }),
    );
    if (isEmpty(res?.data)) {
      Modal.confirm({
        getContainer: () =>
          document.getElementById('te-prefs-lib') as HTMLElement,
        content:
          "The joint teaching object or the timing doesn't match for those activities, are you sure you want to continue",
        onOk: () => doSubmit(e),
        onCancel: () => {
          if (typeof onCancel === 'function') {
            onCancel(e);
          }
        },
      });
    } else {
      doSubmit(e);
    }
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
        formId={formId}
        activities={activities}
        selectedActivities={selectedActivities}
        onSelect={(activityIds) => setSelectedActivities(activityIds)}
      />
    </Modal>
  );
};

export default AddActivitiesToJointTeachingGroupModal;
