import { Button, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// ACTIONS
import { setFilterValues } from 'Redux/Filters/filters.actions';

// SELECTORS
import { hasPermission } from 'Redux/Auth/auth.selectors';
import { selectSelectedFilterValues } from 'Redux/Filters/filters.selectors';

// COMPONENTS
import ActivityFiltering from '../DEPR_ActivityFiltering';

// STYLES
import './index.scss';

// CONSTANTS
import { ASSISTED_SCHEDULING_PERMISSION_NAME } from '../../Constants/permissions.constants';

// TYPES
import { ACTIVITIES_TABLE } from 'Constants/tables.constants';
import { selectAllActivitiesAreScheduling } from 'Redux/DEPR_ActivityScheduling/activityScheduling.selectors';

type Props = {
  selectedActivityIds: string[];
  onSelectAll(): void;
  onDeselectAll(): void;
  onAllocateActivities(activities: string[]): void;
  onDeallocateActivities(activities: string[]): void;
  allActivities: string[];
};

const GroupManagementToolbar = ({
  selectedActivityIds,
  onSelectAll,
  onDeselectAll,
  onAllocateActivities,
  onDeallocateActivities,
  allActivities,
}: Props) => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();

  const selectedFilterValues = useSelector(
    selectSelectedFilterValues({ formId, origin: ACTIVITIES_TABLE }),
  );
  const allActivitiesAreScheduling = useSelector(
    selectAllActivitiesAreScheduling(formId),
  );

  const hasSchedulingPermissions = useSelector(
    hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME),
  );

  return (
    <div className='activities-toolbar--wrapper'>
      Activities selected:&nbsp; {selectedActivityIds?.length ?? 0}
      <Button size='small' type='link' onClick={onSelectAll}>
        Select all
      </Button>
      <Button
        size='small'
        type='link'
        onClick={onDeselectAll}
        disabled={!selectedActivityIds?.length}
      >
        Deselect all
      </Button>
      <Divider type='vertical' />
      <Button
        size='small'
        type='link'
        onClick={() => onAllocateActivities(selectedActivityIds)}
        disabled={!selectedActivityIds?.length || !hasSchedulingPermissions}
      >
        Allocate
      </Button>
      <Button
        size='small'
        type='link'
        onClick={() => onDeallocateActivities(allActivities)}
        disabled={
          !allActivities?.length ||
          !hasSchedulingPermissions ||
          allActivitiesAreScheduling
        }
      >
        Deallocate
      </Button>
      <Divider type='vertical' />
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

export default GroupManagementToolbar;
