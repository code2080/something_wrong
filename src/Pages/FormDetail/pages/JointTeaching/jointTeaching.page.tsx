import { Button, Radio } from 'antd';

import JointTeachingTabs, {
  ActiveJointTeachingTab,
} from 'Components/JointTeaching/JointTeachingTabs';

// SELETORS
import { createLoadingSelector } from 'Redux/APIStatus/apiStatus.selectors';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';

import {
  JointTeachingMatchedActivities,
  JointTeachingUnmatchedActivities,
} from 'Components/JointTeaching/';

// ACTIONS

// import './jointTeaching.page.scss';
import { generateJointTeachingGroup } from 'Redux/JointTeaching/jointTeaching.actions';
import { GENERATE_JOINT_TEACHING_GROUP } from 'Redux/JointTeaching/jointTeaching.actionTypes';

import { generateJointTeachingMatchNotifications } from 'Utils/notifications.helper';

const JointTeachingPage = () => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();
  const [activeTab, setActiveTab] =
    useState<ActiveJointTeachingTab>('unmatchedTab');
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

  const renderTab = (activeTab: ActiveJointTeachingTab) => {
    const outcomes: Record<ActiveJointTeachingTab, () => JSX.Element> = {
      unmatchedTab: () => (
        <JointTeachingUnmatchedActivities
          //todo: these props are wierd... remove if possible
          triggerFetchingActivities={triggerFetchingActivities}
          setTriggerFetchingActivities={setTriggerFetchingActivities}
        />
      ),
      matchedTab: () => <JointTeachingMatchedActivities />,
    };

    return outcomes[activeTab]();
  };

  return (
    <>
      <div className='jointTeaching-buttons--wrapper'>
        <div className='jointTeaching-tabs'>
          <JointTeachingTabs
            activeTab={activeTab}
            setActiveTab={(tab) => setActiveTab(tab)}
          />
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
      {renderTab(activeTab)}
    </>
  );
};
export default JointTeachingPage;
