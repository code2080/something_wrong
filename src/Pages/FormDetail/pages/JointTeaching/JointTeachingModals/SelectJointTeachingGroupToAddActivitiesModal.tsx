import React from 'react';

import { Modal, ModalProps } from 'antd';
import JointTeachingGroupsTable from '../JointTeachingGroupsTable/JointTeachingGroupsTable';

interface Props extends ModalProps {
  onSelect: (groupId: string) => void;
}
const SelectJointTeachingGroupToAddActivitiesModal = (props: Props) => {
  const { visible, onCancel, onSelect } = props;
  return (
    <Modal
      width={900}
      visible={visible}
      onCancel={onCancel}
      title='Add to joint teaching match'
      footer={false}
    >
      <JointTeachingGroupsTable readonly onGroupSelect={onSelect} />
    </Modal>
  );
};
export default SelectJointTeachingGroupToAddActivitiesModal;
