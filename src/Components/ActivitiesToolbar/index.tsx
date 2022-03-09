/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from 'antd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GroupOutlined, OrderedListOutlined } from '@ant-design/icons';

// REDUX
import { setFilterValues } from 'Redux/Filters/filters.actions';

// SELECTORS
import { hasPermission } from 'Redux/Auth/auth.selectors';

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

// TYPES
import { ACTIVITIES_TABLE } from 'Constants/tables.constants';

const ActivitiesToolbar = () => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();

  const { selectedKeys } = useSSP();

  /**
   * SELECTORS
   */
  const hasSchedulingPermissions = useSelector(
    hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME),
  );

  /**
   * EVENT HANDLERS
   */
  const onScheduleActivities = (args?: any) => {
    console.log('onScheduleActivities');
  };

  const onScheduleAllActivities = (args?: any) => {
    console.log('onScheduleAllActivities');
  };

  const onDeleteActivities = (args?: any) => {
    console.log('onDeleteActivities');
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
          disabled={!hasSchedulingPermissions} // @todo add check for if we are scheduling already?
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
        <GroupingRadioGroup
          value='FLAT'
          options={[
            {
              value: 'FLAT',
              label: <OrderedListOutlined />,
              tooltip: 'Flat list',
            },
            {
              value: 'WEEK_PATTERN',
              label: <GroupOutlined />,
              tooltip: 'Week pattern',
            },
          ]}
          onSelect={(val) => console.log(val)}
        />
        <ActivityFiltering />
      </ToolbarGroup>
    </div>
  );
};

export default ActivitiesToolbar;
