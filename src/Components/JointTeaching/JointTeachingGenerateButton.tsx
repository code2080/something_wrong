import { Button } from 'antd';
import { useDispatch } from 'react-redux';

// todo: not sure if i want to keep this
const JointTeachingGenerateButton = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  /*   const onGenerate = async () => {
    const generateResponse = await dispatch(
      generateJointTeachingGroup({ formId }),
    );
    setTriggerFetchingActivities(triggerFetchingActivities + 1);
    if (!(generateResponse instanceof Error) && generateResponse) {
      generateJointTeachingMatchNotifications(
        generateResponse?.data.length > 0 ? 'success' : 'warning',
        generateResponse?.data.length,
      );
    } else {
      generateJointTeachingMatchNotifications('error');
    }
  }; */

  const onGenerate = () => {};

  return (
    <Button
      onClick={onGenerate}
      style={{ color: 'black' }}
      //   loading={!!generating}
    >
      Generate joint teaching matches
    </Button>
  );
};

export default JointTeachingGenerateButton;
