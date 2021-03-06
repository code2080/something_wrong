import { Button, Radio } from 'antd';

// SELETORS
import { createLoadingSelector } from 'Redux/APIStatus/apiStatus.selectors';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';

import UnmatchedActivities from './DEPR_JointTeaching/UnmatchedActivities';
import MatchedActivities from './DEPR_JointTeaching/DEPR_MatchedActivities';

// ACTIONS

import './jointTeaching.page.scss';
import { generateJointTeachingGroup } from 'Redux/JointTeaching/jointTeaching.actions';
import { GENERATE_JOINT_TEACHING_GROUP } from 'Redux/JointTeaching/jointTeaching.actionTypes';
import { generateJointTeachingMatchNotifications } from '../../../Utils/notifications.helper';

const JointTeachingPage = () => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();
  const [activeTab, setActiveTab] = useState('unmatchedTab');
  const generating = useSelector(
    createLoadingSelector([GENERATE_JOINT_TEACHING_GROUP]),
  );

  const [triggerFetchingActivities, setTriggerFetchingActivities] = useState(0);

  const onGenerate = async () => {
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
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'matchedTab':
        return <MatchedActivities />;
      default:
        return (
          <UnmatchedActivities
            formId={formId}
            triggerFetchingActivities={triggerFetchingActivities}
            setTriggerFetchingActivities={setTriggerFetchingActivities}
          />
        );
    }
  };

  return (
    <>
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
            <Radio.Button value='unmatchedTab'>
              Unmatched activities
            </Radio.Button>
            <Radio.Button value='matchedTab'>Matched activities</Radio.Button>
          </Radio.Group>
        </div>
        {activeTab === 'unmatchedTab' && (
          <Button
            onClick={onGenerate}
            style={{ color: 'black' }}
            loading={!!generating}
          >
            Generate joint teaching matches
          </Button>
        )}
      </div>
      {renderTab()}
    </>
  );
};
export default JointTeachingPage;
