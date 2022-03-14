import React, { Key } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Modal, ModalProps } from 'antd';
import JointTeachingGroupsTable from '../JointTeachingGroupsTable/JointTeachingGroupsTable';
import JointTeachingGroup from 'Models/JointTeachingGroup.model';
import { addActivityToJointTeachingGroup } from 'Redux/JointTeaching/jointTeaching.actions';
import { createLoadingSelector } from 'Redux/APIStatus/apiStatus.selectors';
import {
  ADD_ACTIVITY_TO_JOINT_TEACHING_GROUP,
  CALCULATE_JOINT_TEACHING_MATCHING_SCORE,
} from 'Redux/JointTeaching/jointTeaching.actionTypes';
import { useJointTeachingCalculating } from 'Hooks/jointTeaching';

interface Props extends Omit<ModalProps, 'onCancel'> {
  formId: string;
  selectedActivityIds: Key[];
  onCancel: (refetchNeeded?: boolean) => void;
}
const SelectJointTeachingGroupToAddActivitiesModal = (props: Props) => {
  const { visible, onCancel, formId, selectedActivityIds } = props;
  const dispatch = useDispatch();
  const calculating = useSelector(
    createLoadingSelector([
      CALCULATE_JOINT_TEACHING_MATCHING_SCORE,
      ADD_ACTIVITY_TO_JOINT_TEACHING_GROUP,
    ]),
  );
  const jointTeachingCalculating = useJointTeachingCalculating({ formId });

  const doAddingToGroup = async (jointTeachingId: string) => {
    await dispatch(
      addActivityToJointTeachingGroup({
        formId,
        jointTeachingId,
        activityIds: selectedActivityIds,
      }),
    );
    onCancel(true);
  };

  const onSelect = async (group: JointTeachingGroup) => {
    const canBePaired = await jointTeachingCalculating.activitiesCanBePaired([
      ...group.activityIds,
      ...selectedActivityIds,
    ]);
    jointTeachingCalculating.addActivitiesToJointTeachingMatchRequest({
      canBePaired,
      onSubmit: () => doAddingToGroup(group._id),
    });
  };
  return (
    <Modal
      width={900}
      visible={visible}
      onCancel={() => onCancel()}
      title='Add to joint teaching match'
      footer={false}
    >
      <JointTeachingGroupsTable
        readonly
        onGroupSelect={onSelect}
        groupSelecting={!!calculating}
      />
    </Modal>
  );
};
export default SelectJointTeachingGroupToAddActivitiesModal;
