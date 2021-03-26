import { Button, Popover } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// SELECTORS
import { selectActivitiesForFormAndIds } from '../../Redux/Activities/activities.selectors';

// COMPONENTS
import ActivityGroupPopover from '../ActivitiesTableColumns/SchedulingColumns/ActivityGrouping/Popover';
import ActivityFiltering from '../ActivityFiltering';

// STYLES
import './index.scss';

// TYPES
import { TActivity } from '../../Types/Activity.type';

type Props = {
  selectedRowKeys: string[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
};

/**
 * OPTIONS FOR ACTIVITIES
 * x) View selection
 * x) Group activities
 * x) Schedule activities
 */
const ActivitiesToolbar = ({
  selectedRowKeys,
  onSelectAll,
  onDeselectAll,
}: Props) => {
  const { formId }: { formId: string } = useParams();
  const activities: TActivity[] = useSelector(selectActivitiesForFormAndIds)(
    formId,
    selectedRowKeys,
  );

  return (
    <div className='activities-toolbar--wrapper'>
      <div className='activities-toolbar--item'>
        <span className='activities-toolbar--item-label'>
          Activities selected:&nbsp;
        </span>
        {selectedRowKeys.length}
      </div>
      <div className='activities-toolbar--item'>
        <Button size='small' type='link' onClick={onSelectAll}>
          Select all
        </Button>
        <Button
          size='small'
          type='link'
          onClick={onDeselectAll}
          disabled={!selectedRowKeys || !selectedRowKeys.length}
        >
          Deselect all
        </Button>
      </div>
      <div className='activities-toolbar--item'>
        <Popover
          overlayClassName='activity-group-popover--wrapper'
          title='Group activity'
          content={<ActivityGroupPopover activities={activities} />}
          getPopupContainer={() =>
            document.getElementById('te-prefs-lib') as HTMLElement
          }
          trigger='hover'
          placement='rightTop'
        >
          <Button
            size='small'
            type='link'
            disabled={!selectedRowKeys || !selectedRowKeys.length}
          >
            Group selected activities
          </Button>
        </Popover>
      </div>
      <ActivityFiltering />
    </div>
  );
};

export default ActivitiesToolbar;
