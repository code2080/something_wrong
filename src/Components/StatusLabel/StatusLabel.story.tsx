import Label from './StatusLabel';

export default {
  title: 'Activity Manager/Components/StatusLabel',
  component: Label,
  argTypes: {},
};

export const StatusLabel = (args) => {
  return <Label {...args}>Not Scheduled</Label>;
};

StatusLabel.args = {
  color: 'default',
};
