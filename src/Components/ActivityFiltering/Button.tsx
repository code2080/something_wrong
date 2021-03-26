import { Button } from 'antd';
import { FilterFilled } from '@ant-design/icons';

import './button.scss';

// TYPES
type Props = {
  onClick: () => void;
  isActive: boolean;
};

const ActivityFilterButton = ({ onClick, isActive }: Props) => (
  <Button
    size='small'
    shape='circle'
    ghost
    className={`filter-btn ${isActive && 'active'}`}
    onClick={onClick}
  >
    <FilterFilled />
  </Button>
);

export default ActivityFilterButton;
