import { Button, Divider, Popover } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// SELECTORS
import { makeSelectActivitiesForFormAndIds } from '../../Redux/Activities/activities.selectors';
import { hasPermission } from '../../Redux/Auth/auth.selectors';

// COMPONENTS
import ActivityTagPopover from '../ActivitiesTableColumns/SchedulingColumns/ActivityTaging/Popover';
import ActivityFiltering from '../ActivityFiltering';

// STYLES
import './index.scss';

// CONSTANTS
import { ASSISTED_SCHEDULING_PERMISSION_NAME } from '../../Constants/permissions.constants';

// TYPES
import { TActivity } from '../../Types/Activity.type';
import { Key, useMemo } from 'react';
import JointTeachingGroupMerger from 'Components/JointTeachingGroup/JointTeachingGroupMerger';
import { activityFilterFn } from 'Utils/activities.helpers';

type Props = {
  selectedRowKeys: Key[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onScheduleActivities: (activities) => void;
  onDeleteActivities: (activities) => void;
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
  onDeleteActivities,
  allActivities,
}: Props) => {
  const { formId }: { formId: string } = useParams();
  const selectActivitiesForFormAndIds = useMemo(
    () => makeSelectActivitiesForFormAndIds(),
    [],
  );
  const selectedActivities: TActivity[] = useSelector((state) =>
    selectActivitiesForFormAndIds(state, {
      formId,
      activityIds: selectedRowKeys as string[],
    }),
  );

  const deleteableActivities: TActivity[] = useMemo(
    () => selectedActivities.filter(activityFilterFn.canBeDeleted),
    [selectedActivities],
  );

  const hasSchedulingPermissions = useSelector(
    hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME),
  );

  const TagSelectedActivitiesButton = () =>
    !selectedRowKeys?.length ? (
      <Button size='small' type='link' disabled>
        Tag selected activities
      </Button>
    ) : (
      <Popover
        overlayClassName='activity-tag-popover--wrapper'
        title='Tag activity'
        content={<ActivityTagPopover activities={selectedActivities} />}
        getPopupContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
        trigger='click'
        placement='rightTop'
      >
        <Button size='small' type='link'>
          Tag selected activities
        </Button>
      </Popover>
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
        onClick={() => onScheduleActivities(selectedActivities)}
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
      <Button
        size='small'
        type='link'
        onClick={() => onDeleteActivities(deleteableActivities)}
        disabled={!deleteableActivities?.length || !hasSchedulingPermissions}
      >
        Delete reservations
      </Button>
      <Divider type='vertical' />
      <TagSelectedActivitiesButton />
      <JointTeachingGroupMerger
        activities={selectedActivities}
        formId={formId}
      />
      <ActivityFiltering />
    </div>
  );
};

export default ActivitiesToolbar;
