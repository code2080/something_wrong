import React from 'react';
import { Icon } from 'antd';

// TYPES
import { TActivity } from '../../../../Types/Activity.type';
type Props = {
  activity: TActivity,
};

const GroupingButton = ({ activity }: Props) => {
  return (
    <div className="scheduling-actions--status">
      <Icon type="appstore" />
    </div>
  );
};

export default GroupingButton;
