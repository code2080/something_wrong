import { Radio } from 'antd';

export type ActiveJointTeachingTab = 'unmatchedTab' | 'matchedTab';

const JointTeachingTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: ActiveJointTeachingTab;
  setActiveTab: (tab: ActiveJointTeachingTab) => void;
}) => {
  return (
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
  );
};

export default JointTeachingTabs;
