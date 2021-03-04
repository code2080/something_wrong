import React from 'react';
import { Button, Icon } from 'antd';

// TYPES
type Props = {
  onClick: () => void,
  isActive: boolean,
};

const ActivityFilterButton = ({ onClick, isActive }: Props) => {
  if (!isActive)
    return (
      <Button size='small' ghost className='inactive' onClick={onClick}>
        <Icon type='filter' />
      </Button>
    );

  return (
    <Button size='small' ghost className='active' onClick={onClick}>
      <Icon type='filter' theme='filled' />
    </Button>
  );
};

export default ActivityFilterButton;
