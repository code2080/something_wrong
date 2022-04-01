import { Button } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  CalendarOutlined,
  OrderedListOutlined,
  TagOutlined,
} from '@ant-design/icons';

// REDUX
import { hasPermission } from 'Redux/Auth/auth.selectors';
import { selectFormAllowedGroupings } from 'Redux/Forms';

// COMPONENTS
import JointTeachingGroupMerger from 'Components/JointTeachingGroup/JointTeachingGroupMerger';
import ActivityFiltering from '../ActivitySSPFilters';
import StatusLabel from 'Components/StatusLabel';
import TagSelectionButton from './TagSelectionButton';
import ToolbarGroup from './ToolbarGroup';
import GroupingRadioGroup from './ToolbarRadioGroup';

// HOOKS
import useSSP from 'Components/SSP/Utils/hooks';
import { useScheduling } from 'Hooks/useScheduling';

// STYLES
import './index.scss';

// CONSTANTS
import { ASSISTED_SCHEDULING_PERMISSION_NAME } from '../../Constants/permissions.constants';

// TYPES
import { EActivityGroupings } from 'Types/Activity/ActivityGroupings.enum';

const ActivitiesToolbar = () => {
  const { formId } = useParams<{ formId: string }>();
  const { selectedKeys, groupBy, setGroup } = useSSP();
  const { unscheduleSelectedActivities } = useScheduling();
  /**
   * SELECTORS
   */
  const hasSchedulingPermissions = useSelector(
    hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME),
  );
  const allowedGroupings = useSelector(selectFormAllowedGroupings(formId));

  /**
   * EVENT HANDLERS
   */
  const onDeleteActivities = (idsToDelete: string[]) => {
    unscheduleSelectedActivities(idsToDelete);
  };

  const onCreateMatchCallback = () => {
    console.log('onCreateMatchCallback');
  };

  return (
    <div className='activities-toolbar--wrapper'>
      <ToolbarGroup label='Selection'>
        <StatusLabel color='default'>{selectedKeys.length || 0}</StatusLabel>
      </ToolbarGroup>
      <ToolbarGroup label='Actions'>
        <Button
          size='small'
          type='link'
          onClick={() => onDeleteActivities(selectedKeys)}
          disabled={!selectedKeys?.length || !hasSchedulingPermissions}
        >
          Cancel selection
        </Button>
        <TagSelectionButton selectedActivityIds={selectedKeys || []} />
        <JointTeachingGroupMerger
          activityIds={selectedKeys}
          formId={formId}
          onCreateMatchCallback={onCreateMatchCallback}
        />
      </ToolbarGroup>
      <ToolbarGroup label='Grouping &amp; filters'>
        <GroupingRadioGroup
          value={groupBy}
          options={[
            {
              value: EActivityGroupings.FLAT,
              label: <OrderedListOutlined />,
              tooltip: 'List',
              disabled: !allowedGroupings.FLAT,
            },
            {
              value: EActivityGroupings.WEEK_PATTERN,
              label: <CalendarOutlined />,
              tooltip: 'Week pattern',
              disabled: !allowedGroupings.WEEK_PATTERN,
            },
            {
              value: EActivityGroupings.TAG,
              label: <TagOutlined />,
              tooltip: 'Tag',
              disabled: !allowedGroupings.TAG,
            },
          ]}
          onSelect={(val) => setGroup(val as EActivityGroupings)}
        />
        <ActivityFiltering />
      </ToolbarGroup>
    </div>
  );
};

export default ActivitiesToolbar;
