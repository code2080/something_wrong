import { Button, Divider, Popover } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// SELECTORS
import { makeSelectActivitiesForFormAndIds } from '../../Redux/Activities/activities.selectors';
import { hasPermission } from '../../Redux/Auth/auth.selectors';

// COMPONENTS
import ActivityTagPopover from '../ActivitiesTableColumns/SchedulingColumns/ActivityTaging/Popover';
// import ActivityFiltering from '../ActivityFiltering';

// STYLES
import './index.scss';

// CONSTANTS
import { ASSISTED_SCHEDULING_PERMISSION_NAME } from '../../Constants/permissions.constants';

// TYPES
import { TActivity } from '../../Types/Activity.type';
import { useMemo } from 'react';

type Props = {
  selectedRowKeys: string[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onScheduleActivities: (activities) => void;
  allActivities: TActivity[];
};

/**
 * OPTIONS FOR ACTIVITIES
 * x) View selection
 * x) Tag activities
 * x) Schedule activities
 */
const ActivitiesToolbar = ({
  selectedRowKeys,
  onSelectAll,
  onDeselectAll,
  onScheduleActivities,
  allActivities,
}: Props) => {
  const { formId }: { formId: string } = useParams();
  const selectActivitiesForFormAndIds = useMemo(
    () => makeSelectActivitiesForFormAndIds(),
    [],
  );
  const activities: TActivity[] = useSelector((state) =>
    selectActivitiesForFormAndIds(state, {
      formId,
      activityIds: selectedRowKeys,
    }),
  );
  const hasSchedulingPermissions = useSelector(
    hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME),
  );

  return (
    <div className='activities-toolbar--wrapper'>
      Activities selected:&nbsp; {selectedRowKeys?.length ?? 0}
      <Button size='small' type='link' onClick={onSelectAll}>
        Select all
      </Button>
      <Button
        size='small'
        type='link'
        onClick={onDeselectAll}
        disabled={!selectedRowKeys?.length}
      >
        Deselect all
      </Button>
      <Divider type='vertical' />
      <Button
        size='small'
        type='link'
        onClick={() => onScheduleActivities(activities)}
        disabled={!selectedRowKeys?.length || !hasSchedulingPermissions}
      >
        Schedule selected activities
      </Button>
      <Button
        size='small'
        type='link'
        onClick={() => onScheduleActivities(allActivities)}
        disabled={!allActivities?.length || !hasSchedulingPermissions}
      >
        Schedule activities
      </Button>
      <Divider type='vertical' />
      <Popover
        overlayClassName='activity-tag-popover--wrapper'
        title='Tag activity'
        content={<ActivityTagPopover activities={activities} />}
        getPopupContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
        trigger='hover'
        placement='rightTop'
      >
        <Button size='small' type='link' disabled={!selectedRowKeys?.length}>
          Tag selected activities
        </Button>
      </Popover>
      {/* <ActivityFiltering /> */}
    </div>
  );
};

export default ActivitiesToolbar;
