import { Button, Radio, Row } from 'antd';

import JointTeachingTabs, {
  ActiveJointTeachingTab,
} from 'Components/JointTeaching/JointTeachingTabs';

// SELETORS
import { createLoadingSelector } from 'Redux/APIStatus/apiStatus.selectors';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';

import {
  MatchedActivities,
  UnmatchedActivities,
} from 'Components/JointTeaching/';
// import './jointTeaching.page.scss';

// ACTIONS

import { generateJointTeachingGroup } from 'Redux/JointTeaching/jointTeaching.actions';
import { GENERATE_JOINT_TEACHING_GROUP } from 'Redux/JointTeaching/jointTeaching.actionTypes';

import { generateJointTeachingMatchNotifications } from 'Utils/notifications.helper';

const JointTeachingPage = () => {
  const [activeTab, setActiveTab] =
    useState<ActiveJointTeachingTab>('unmatchedTab');
  const generating = useSelector(
    createLoadingSelector([GENERATE_JOINT_TEACHING_GROUP]),
  );

  const [triggerFetchingActivities, setTriggerFetchingActivities] = useState(0);

  const renderTab = (activeTab: ActiveJointTeachingTab) => {
    const outcomes: Record<ActiveJointTeachingTab, () => JSX.Element> = {
      unmatchedTab: () => <UnmatchedActivities />,
      matchedTab: () => <MatchedActivities />,
    };

    return outcomes[activeTab]();
  };

  return (
    <>
      <JointTeachingTabs
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab)}
      />
      {renderTab(activeTab)}
    </>
  );
};
export default JointTeachingPage;
