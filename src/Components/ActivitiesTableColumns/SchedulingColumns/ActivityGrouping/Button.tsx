import React from 'react';
import { Button } from 'antd';

// TYPES
import { TActivity } from '../../../../Types/Activity.type';
type Props = {
  activity: TActivity,
};

const GroupingButton = ({ activity }: Props) => {
  return (
    <Button size="small" icon="appstore">
      N/A
    </Button>
  );
};

export default GroupingButton;
