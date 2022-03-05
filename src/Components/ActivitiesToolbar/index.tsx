import { Button } from 'antd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GroupOutlined, OrderedListOutlined } from '@ant-design/icons';

// REDUX
import { setFilterValues } from 'Redux/Filters/filters.actions';

// SELECTORS
import { hasPermission } from 'Redux/Auth/auth.selectors';
import { selectSelectedFilterValues } from 'Redux/Filters/filters.selectors';

// COMPONENTS
import JointTeachingGroupMerger from 'Components/JointTeachingGroup/JointTeachingGroupMerger';
import ActivityFiltering from '../ActivityFiltering';
import StatusLabel from 'Components/StatusLabel';
import TagSelectionButton from './TagSelectionButton';
import ToolbarGroup from './ToolbarGroup';
import GroupingRadioGroup from './ToolbarRadioGroup';

// STYLES
import './index.scss';

// CONSTANTS
import { ASSISTED_SCHEDULING_PERMISSION_NAME } from '../../Constants/permissions.constants';

// TYPES
import { ACTIVITIES_TABLE } from 'Constants/tables.constants';
import { selectAllActivitiesAreScheduling } from 'Redux/ActivityScheduling/activityScheduling.selectors';

type Props = {
  selectedActivityIds: string[];
  onScheduleActivities(activities: string[]): void;
  onScheduleAllActivities(): void;
  onDeleteActivities(activities: string[]): void;
  allActivities: string[];
  onCreateMatchCallback: () => void;
};

const ActivitiesToolbar = ({
  selectedActivityIds,
  onScheduleActivities,
  onDeleteActivities,
  allActivities,
  onCreateMatchCallback,
  onScheduleAllActivities,
}: Props) => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();

  /**
   * SELECTORS
   */
  const selectedFilterValues = useSelector(selectSelectedFilterValues({ formId, origin: ACTIVITIES_TABLE }));
  const allActivitiesAreScheduling = useSelector(selectAllActivitiesAreScheduling(formId));
  const hasSchedulingPermissions = useSelector(hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME));

  return (
    <div className='activities-toolbar--wrapper'>
      <ToolbarGroup label='Selection'>
        <StatusLabel color="default">{selectedActivityIds?.length || 0}</StatusLabel>  
      </ToolbarGroup>
      <ToolbarGroup label='Schedule'>
        <Button
          size='small'
          type='link'
          onClick={() => onScheduleAllActivities()}
          disabled={
            !allActivities?.length ||
            !hasSchedulingPermissions ||
            allActivitiesAreScheduling
          }
        >
          All
        </Button>
        <Button
          size='small'
          type='link'
          onClick={() => onScheduleActivities(selectedActivityIds)}
          disabled={!selectedActivityIds?.length || !hasSchedulingPermissions}
        >
          Selection
        </Button>
        <Button
          size='small'
          type='link'
          onClick={() => onDeleteActivities(selectedActivityIds)}
          disabled={!selectedActivityIds?.length || !hasSchedulingPermissions}
        >
          Cancel selection
        </Button>
      </ToolbarGroup>
      <ToolbarGroup label='Actions'>
        <TagSelectionButton selectedActivityIds={selectedActivityIds || []} />
        <JointTeachingGroupMerger
          activityIds={selectedActivityIds}
          formId={formId}
          onCreateMatchCallback={onCreateMatchCallback}
        />
      </ToolbarGroup>
      <ToolbarGroup label='Grouping & filters'>
        <GroupingRadioGroup
          value='FLAT'
          options={[
            { value: 'FLAT', label: <OrderedListOutlined />, tooltip: 'Flat list' },
            { value: 'WEEK_PATTERN', label: <GroupOutlined />, tooltip: 'Week pattern' }
          ]}
          onSelect={(val) => console.log(val)}
        />
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
      </ToolbarGroup>
    </div>
  );
};

export default ActivitiesToolbar;
