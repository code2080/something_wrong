import { Key } from 'react';
import { Button, Divider, Popover } from 'antd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// ACTIONS
import { setFilterValues } from 'Redux/Filters/filters.actions';

// SELECTORS
import { hasPermission, selectIsBetaOrDev } from 'Redux/Auth/auth.selectors';
import { selectSelectedFilterValues } from 'Redux/Filters/filters.selectors';

// COMPONENTS
import JointTeachingGroupMerger from 'Components/JointTeachingGroup/JointTeachingGroupMerger';
import ActivityTagPopover from '../ActivitiesTableColumns/SchedulingColumns/ActivityTaging/Popover';
import ActivityFiltering from '../ActivityFiltering';

// STYLES
import './index.scss';

// CONSTANTS
import { ASSISTED_SCHEDULING_PERMISSION_NAME } from '../../Constants/permissions.constants';

// TYPES
import { ACTIVITIES_TABLE } from 'Constants/tables.constants';
import { selectAllActivitiesAreScheduling } from 'Redux/ActivityScheduling/activityScheduling.selectors';

type Props = {
  selectedRowKeys: Key[];
  onSelectAll(): void;
  onDeselectAll(): void;
  onScheduleActivities(activities: string[]): void;
  onDeleteActivities(activities: string[]): void;
  allActivities: string[];
  onCreateMatchCallback: () => void;
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
  onCreateMatchCallback,
}: Props) => {
  const dispatch = useDispatch();
  const { formId }: { formId: string } = useParams();

  const selectedFilterValues = useSelector(
    selectSelectedFilterValues({ formId, origin: ACTIVITIES_TABLE }),
  );
  const allActivitiesAreScheduling = useSelector(
    selectAllActivitiesAreScheduling(formId),
  );

  const deleteableActivities = [];

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
        content={
          <ActivityTagPopover
            selectedActivityIds={selectedRowKeys as string[]}
          />
        }
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
        onClick={() => onScheduleActivities(selectedRowKeys as string[])}
        disabled={!selectedRowKeys?.length || !hasSchedulingPermissions}
      >
        Schedule selected activities
      </Button>
      <Button
        size='small'
        type='link'
        onClick={() => onScheduleActivities(allActivities)}
        disabled={
          !allActivities?.length ||
          !hasSchedulingPermissions ||
          allActivitiesAreScheduling
        }
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
          activityIds={selectedRowKeys as string[]}
          formId={formId}
          onCreateMatchCallback={onCreateMatchCallback}
        />
      )}
      <ActivityFiltering
        selectedFilterValues={selectedFilterValues}
        onSubmit={(values) => {
          dispatch(
            setFilterValues({
              formId,
              values,
              origin: ACTIVITIES_TABLE,
            }),
          );
        }}
      />
    </div>
  );
};

export default ActivitiesToolbar;
