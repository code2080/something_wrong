import React from 'react';
import { Button, Icon } from 'antd';

import './button.scss';

// TYPES
type Props = {
  onClick: () => void,
  isActive: boolean,
};

const ActivityFilterButton = ({ onClick, isActive }: Props) =>
  <Button size='small' shape='circle' ghost className={`filter-btn ${isActive && 'active'}`} onClick={onClick}>
    <Icon type='filter' theme='filled' />
  </Button>;

export default ActivityFilterButton;