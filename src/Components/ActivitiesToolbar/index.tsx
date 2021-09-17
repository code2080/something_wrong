import { Key, useMemo } from 'react';
import { Button, Divider, Popover } from 'antd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// ACTIONS
import { setSelectedFilterValues } from 'Redux/Filters/filters.actions';

// SELECTORS
import { activityFilterFn } from 'Utils/activities.helpers';
import { makeSelectActivitiesForFormAndIds } from 'Redux/Activities/activities.selectors';
import { hasPermission, selectIsBetaOrDev } from 'Redux/Auth/auth.selectors';
import { makeSelectSelectedFilterValues } from 'Redux/Filters/filters.selectors';

// COMPONENTS
import JointTeachingGroupMerger from 'Components/JointTeachingGroup/JointTeachingGroupMerger';
import ActivityTagPopover from '../ActivitiesTableColumns/SchedulingColumns/ActivityTaging/Popover';
import ActivityFiltering from '../ActivityFiltering';

// STYLES
import './index.scss';

// CONSTANTS
import { ASSISTED_SCHEDULING_PERMISSION_NAME } from '../../Constants/permissions.constants';

// TYPES
import { TActivity } from '../../Types/Activity.type';

type Props = {
  selectedRowKeys: Key[];
  onSelectAll(): void;
  onDeselectAll(): void;
  onScheduleActivities(activities: TActivity[]): void;
  onDeleteActivities(activities: TActivity[]): void;
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
  const dispatch = useDispatch();
  const { formId }: { formId: string } = useParams();
  const selectSelectedFilterValues = useMemo(
    () => makeSelectSelectedFilterValues(),
    [],
  );

  const selectedFilterValues = useSelector((state) =>
    selectSelectedFilterValues(state, `${formId}_ACTIVITIES_TABLE`),
  );

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
    () => selectedActivities.filter(activityFilterFn.canBeSelected),
    [selectedActivities],
  );

  const hasSchedulingPermissions = useSelector(
    hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME),
  );
  const isBetaOrDev = useSelector(selectIsBetaOrDev);

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
        Cancel selected reservations
      </Button>
      <Divider type='vertical' />
      <TagSelectedActivitiesButton />
      {isBetaOrDev && (
        <JointTeachingGroupMerger
          activities={selectedActivities}
          formId={formId}
        />
      )}
      <ActivityFiltering
        selectedFilterValues={selectedFilterValues}
        onSubmit={(values) => {
          dispatch(
            setSelectedFilterValues({
              formId: `${formId}_ACTIVITIES_TABLE`,
              filterValues: values,
            }),
          );
        }}
      />
    </div>
  );
};

export default ActivitiesToolbar;
