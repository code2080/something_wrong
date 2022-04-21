import { Button, Modal } from 'antd';
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
import ActivityFiltering from '../../ActivitySSPFilters';
import StatusLabel from 'Components/StatusLabel';
import TagSelectionButton from '../Components/TagSelectionButton';
import ToolbarGroup from '../Components/ToolbarGroup';
import GroupingRadioGroup from '../Components/ToolbarRadioGroup';

// HOOKS
import useSSP from 'Components/SSP/Utils/hooks';
import { useScheduling } from 'Hooks/useScheduling';

// STYLES
import '../index.scss';

// CONSTANTS
import { ASSISTED_SCHEDULING_PERMISSION_NAME } from '../../../Constants/permissions.constants';

// TY
import { EActivityGroupings } from 'Types/Activity/ActivityGroupings.enum';

const ActivitiesToolbar = () => {
  const { formId } = useParams<{ formId: string }>();
  const { selectedKeys, setSelectedKeys, groupBy, setGroup } = useSSP();
  const { unscheduleSelectedActivities } = useScheduling();
  /**
   * SELECTORS
   */
  const hasSchedulingPermissions = useSelector(
    hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME),
  );
  const allowedGroupings = useSelector(
    selectFormAllowedGroupings(formId as string),
  );

  /**
   * EVENT HANDLERS
   */
  const onDeleteActivities = (idsToDelete: string[]) => {
    Modal.confirm({
      getContainer: () =>
        document.getElementById('te-prefs-lib') as HTMLElement,
      title: 'Unschedule activities',
      content:
        "This will cancel all existing reservations and change the activities' status, are you sure you want to proceed?",
      onOk: () => {
        unscheduleSelectedActivities(idsToDelete);
        setSelectedKeys([]);
      },
    });
  };

  const onCreateMatchCallback = () => {
    console.log('onCreateMatchCallback');
  };

  return (
    <div className='detail-toolbar--wrapper'>
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
          Unschedule selection
        </Button>
        <TagSelectionButton />
        <JointTeachingGroupMerger
          activityIds={selectedKeys}
          formId={formId as string}
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
