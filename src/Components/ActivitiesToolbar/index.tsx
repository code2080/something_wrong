/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GroupOutlined, OrderedListOutlined } from '@ant-design/icons';

// SELECTORS
import { hasPermission, selectCoreUserId } from 'Redux/Auth/auth.selectors';

// COMPONENTS
import JointTeachingGroupMerger from 'Components/JointTeachingGroup/JointTeachingGroupMerger';
import ActivityFiltering from '../ActivitySSPFilters';
import StatusLabel from 'Components/StatusLabel';
import TagSelectionButton from './TagSelectionButton';
import ToolbarGroup from './ToolbarGroup';
import GroupingRadioGroup from './ToolbarRadioGroup';

// HOOKS
import useSSP from 'Components/SSP/Utils/hooks';

// STYLES
import './index.scss';

// CONSTANTS
import { ASSISTED_SCHEDULING_PERMISSION_NAME } from '../../Constants/permissions.constants';
import { EActivityGroupings } from 'Types/Activity/ActivityGroupings.enum';
import { selectFormHasWeekPatternEnabled } from 'Redux/Forms';
import { batchOperationSchedule } from 'Redux/Activities';
import {
  EActivityBatchOperation,
  TActivityBatchOperation,
} from 'Types/Activity/ActivityBatchOperations.type';
import { useScheduling } from 'Hooks/useScheduling';

const ActivitiesToolbar = () => {
  const { formId } = useParams<{ formId: string }>();
  const { selectedKeys, groupBy, setGroup } = useSSP();
  const {
    scheduleAllActivities,
    scheduleSelectedActivities,
    unscheduleSelectedActivities,
  } = useScheduling();
  /**
   * SELECTORS
   */
  const hasSchedulingPermissions = useSelector(
    hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME),
  );
  const hasWeekPattern = useSelector(selectFormHasWeekPatternEnabled(formId));

  /**
   * EVENT HANDLERS
   */
  const onScheduleActivities = (activityOrWPGIds: string[]) => {
    scheduleSelectedActivities(activityOrWPGIds);
  };

  const onScheduleAllActivities = () => {
    scheduleAllActivities();
  };

  const onDeleteActivities = (activityOrWPGIds: string[]) => {
    unscheduleSelectedActivities(activityOrWPGIds);
  };

  const onCreateMatchCallback = () => {
    console.log('onCreateMatchCallback');
  };

  return (
    <div className='activities-toolbar--wrapper'>
      <ToolbarGroup label='Selection'>
        <StatusLabel color='default'>{selectedKeys.length || 0}</StatusLabel>
      </ToolbarGroup>
      <ToolbarGroup label='Schedule'>
        <Button
          size='small'
          type='link'
          onClick={() => onScheduleAllActivities()}
          disabled={
            !hasSchedulingPermissions ||
            groupBy === EActivityGroupings.WEEK_PATTERN
          } // @todo add check for if we are scheduling already?
        >
          All
        </Button>
        <Button
          size='small'
          type='link'
          onClick={() => onScheduleActivities(selectedKeys)}
          disabled={!selectedKeys?.length || !hasSchedulingPermissions}
        >
          Selection
        </Button>
        <Button
          size='small'
          type='link'
          onClick={() => onDeleteActivities(selectedKeys)}
          disabled={!selectedKeys?.length || !hasSchedulingPermissions}
        >
          Cancel selection
        </Button>
      </ToolbarGroup>
      <ToolbarGroup label='Actions'>
        <TagSelectionButton selectedActivityIds={selectedKeys || []} />
        <JointTeachingGroupMerger
          activityIds={selectedKeys}
          formId={formId}
          onCreateMatchCallback={onCreateMatchCallback}
        />
      </ToolbarGroup>
      <ToolbarGroup label='Grouping & filters'>
        {hasWeekPattern && (
          <GroupingRadioGroup
            value={groupBy}
            options={[
              {
                value: EActivityGroupings.FLAT,
                label: <OrderedListOutlined />,
                tooltip: 'List',
              },
              {
                value: EActivityGroupings.WEEK_PATTERN,
                label: <GroupOutlined />,
                tooltip: 'Week pattern',
              },
            ]}
            onSelect={(val) => setGroup(val as EActivityGroupings)}
          />
        )}
        <ActivityFiltering />
      </ToolbarGroup>
    </div>
  );
};

export default ActivitiesToolbar;
