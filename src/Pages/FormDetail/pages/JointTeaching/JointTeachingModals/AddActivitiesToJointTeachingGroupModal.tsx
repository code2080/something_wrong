import React, { useEffect, Key } from 'react';
import { Modal, ModalProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

// SELECTORS
import { selectJointTeachingGroupById } from 'Redux/JointTeaching/jointTeaching.selectors';
import { selectSelectedActivities } from 'Redux/GlobalUI/globalUI.selectors';

// ACTIONS
import { selectActivitiesInTable } from 'Redux/GlobalUI/globalUI.actions';

import { useJointTeachingCalculating } from 'Hooks/jointTeaching';
import UnmatchedActivitiesTable from '../Components/UnmatchedActivitiesTable';
import { UNMATCHED_ACTIVITIES_TABLE } from 'Constants/tables.constants';

interface Props extends ModalProps {
  formId: string;
  jointTeachingGroupId?: string;
  onSubmit?: (activityIds: Key[]) => void;
}
const AddActivitiesToJointTeachingGroupModal = (props: Props) => {
  const dispatch = useDispatch();
  const { visible, onCancel, formId, jointTeachingGroupId, onSubmit } = props;
  const jointTeachingGroup = useSelector(
    selectJointTeachingGroupById({ formId, jointTeachingGroupId }),
  );
  const jointTeachingCalculating = useJointTeachingCalculating({ formId });
  const selectedActivityIds = useSelector(
    selectSelectedActivities(UNMATCHED_ACTIVITIES_TABLE),
  );

  const doSubmit = (e) => {
    if (typeof onSubmit === 'function') onSubmit(selectedActivityIds);
    if (typeof onCancel === 'function') onCancel(e);
  };
  const onOk = async (e) => {
    const canBePaired = await jointTeachingCalculating.activitiesCanBePaired([
      ...selectedActivityIds,
      ...(jointTeachingGroup?.activityIds || []),
    ]);
    jointTeachingCalculating.addActivitiesToJointTeachingMatchRequest({
      canBePaired,
      onSubmit: () => doSubmit(e),
    });
  };

  useEffect(() => {
    dispatch(selectActivitiesInTable(UNMATCHED_ACTIVITIES_TABLE, []));
  }, [dispatch, visible]);

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
        disabled: !selectedActivityIds.length,
      }}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}
    >
      <UnmatchedActivitiesTable formId={formId} triggerFetching={0} />
    </Modal>
  );
};

export default AddActivitiesToJointTeachingGroupModal;
