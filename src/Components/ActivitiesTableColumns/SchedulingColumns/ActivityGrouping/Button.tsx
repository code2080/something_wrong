import React from 'react';
import { Button } from 'antd';

// TYPES
import { TActivity } from '../../../../Types/Activity.type';
type Props = {
  activity: TActivity,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GroupingButton = ({ activity }: Props) => {
  return (
    <Button size='small' icon='appstore'>
      N/A
    </Button>
  );
};

export default GroupingButton;
