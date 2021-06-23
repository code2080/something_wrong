import JointTeachingGroupMerger from './JointTeachingGroupMerger';

export default {
  title: 'Activity Manager/Components/JointTeaching',
  component: JointTeachingGroupMerger,
  argTypes: {},
};

export const Merger = (args) => {
  return <JointTeachingGroupMerger {...args} />;
};

Merger.args = {};
