import { Button } from 'antd';
import { FilterFilled } from '@ant-design/icons';
import classnames from 'classnames';
import styles from './button.module.scss';
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
    color={'red'}
    className={classnames([
      styles.filterBtn,
      { [styles.active]: isActive },
      { 'has-filters': hasFilters },
    ])}
    onClick={onClick}
  >
    <FilterFilled />
  </Button>
);

export default ActivityFilterButton;
