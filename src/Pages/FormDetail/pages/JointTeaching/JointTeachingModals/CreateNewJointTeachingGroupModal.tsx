import React, { useEffect, useState } from 'react';

import { Modal, ModalProps, Button } from 'antd';
import { TActivity } from 'Types/Activity.type';
import JointTeachingActivitiesTable from 'Components/ActivitiesTable/JointTeachingActivitiesTable';
import { useDispatch, useSelector } from 'react-redux';

// ACTIONS
import {
  calculateJointTeachingMatchingScore,
  createJointTeachingGroup,
} from 'Redux/JointTeaching/jointTeaching.actions';

// SELETORS
import { createLoadingSelector } from 'Redux/APIStatus/apiStatus.selectors';
import { CALCULATE_JOINT_TEACHING_MATCHING_SCORE } from 'Redux/JointTeaching/jointTeaching.actionTypes';
import { isEmpty } from 'lodash';

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

  useEffect(() => {
    const doCalculating = async () => {
      const res = await dispatch(
        calculateJointTeachingMatchingScore({
          formId,
          activityIds: activities.map(({ _id }) => _id),
        }),
      );
      if (isEmpty(res?.data)) {
        setCanBePaired(false);
      } else {
        setCanBePaired(true);
      }
    };
    if (visible) {
      doCalculating();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!canBePaired) {
      Modal.confirm({
        getContainer: () =>
          document.getElementById('te-prefs-lib') as HTMLElement,
        content:
          "The joint teaching object or the timing doesn't match for those activities, are you sure you want to continue",
        onOk: () => doCreate(),
        onCancel: () => {
          if (typeof onCancel === 'function') {
            onCancel();
          }
        },
      });
    } else {
      doCreate();
    }
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
            <Button onClick={onCreateAndMerge} type='primary'>
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
