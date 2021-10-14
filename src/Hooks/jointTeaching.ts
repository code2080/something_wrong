import { Key } from 'react';
import { useDispatch } from 'react-redux';

// COMPONENTS
import { Modal } from 'antd';

// ACTIONS
import { calculateJointTeachingMatchingScore } from 'Redux/JointTeaching/jointTeaching.actions';

export const useJointTeachingCalculating = ({ formId }: { formId }) => {
  const dispatch = useDispatch();

  const activitiesCanBePaired = async (activityIds: Array<string | Key>) => {
    const res = await dispatch(
      calculateJointTeachingMatchingScore({
        formId,
        activityIds,
      }),
    );
    return res?.data?.some((item) => item.matchingScore);
  };

  const addActivitiesToJointTeachingMatchRequest = async ({
    canBePaired,
    onSubmit,
  }: {
    canBePaired: boolean;
    onSubmit: () => void;
  }) => {
    if (canBePaired) {
      onSubmit();
    } else {
      Modal.confirm({
        getContainer: () =>
          document.getElementById('te-prefs-lib') as HTMLElement,
        content:
          "The joint teaching object or the timing doesn't match for those activities, are you sure you want to continue?",
        onOk: onSubmit,
      });
    }
  };
  return {
    activitiesCanBePaired,
    addActivitiesToJointTeachingMatchRequest,
  };
};
