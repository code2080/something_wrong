import { Button } from 'antd';
import { FilterFilled } from '@ant-design/icons';

import './button.scss';

// TYPES
type Props = {
  onClick: () => void;
  isActive: boolean;
  hasFilters: boolean;
};

const ActivityFilterButton = ({ onClick, isActive, hasFilters }: Props) => (
  <Button
    size='small'
    shape='circle'
    ghost
    className={`${isActive && 'active'} ${hasFilters && 'has-filters'}`}
    onClick={onClick}
  >
    <FilterFilled />
  </Button>
);

export default ActivityFilterButton;
