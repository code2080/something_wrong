import { Button, Radio } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createLoadingSelector } from 'Redux/APIStatus/apiStatus.selectors';
import { generateJointTeachingGroup } from 'Redux/JointTeaching/jointTeaching.actions';
import { GENERATE_JOINT_TEACHING_GROUP } from 'Redux/JointTeaching/jointTeaching.actionTypes';
import { generateJointTeachingMatchNotifications } from 'Utils/notifications.helper';
import './index.scss';

export type ActiveJointTeachingTab = 'unmatchedTab' | 'matchedTab';

const JointTeachingTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: ActiveJointTeachingTab;
  setActiveTab: (tab: ActiveJointTeachingTab) => void;
}) => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch();

  const shouldRenderGenerateButton = activeTab === 'unmatchedTab';

  const generating = useSelector(
    createLoadingSelector([GENERATE_JOINT_TEACHING_GROUP]),
  );

  const onGenerate = async () => {
    const generateResponse = await dispatch(
      generateJointTeachingGroup({ formId }),
    );
    // setTriggerFetchingActivities(triggerFetchingActivities + 1);
    if (!(generateResponse instanceof Error) && generateResponse) {
      generateJointTeachingMatchNotifications(
        generateResponse?.data.length > 0 ? 'success' : 'warning',
        generateResponse?.data.length,
      );
    } else {
      generateJointTeachingMatchNotifications('error');
    }
  };

  return (
    <div className='jointTeaching-buttons--wrapper'>
      <div className='jointTeaching-tabs'>
        <Radio.Group
          buttonStyle='outline'
          defaultValue='unmatchedTab'
          style={{ color: 'black' }}
          size={'small'}
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
        >
          <Radio.Button value='unmatchedTab'>Unmatched activities</Radio.Button>
          <Radio.Button value='matchedTab'>Matched activities</Radio.Button>
        </Radio.Group>
      </div>
      {shouldRenderGenerateButton && (
        <Button
          onClick={onGenerate}
          style={{ color: 'black' }}
          loading={generating}
        >
          Generate joint teaching matches
        </Button>
      )}
    </div>
  );
};

export default JointTeachingTabs;
