import React from 'react';
import { Popover, Button } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// COMPONENTS
import ActivityGroupPopover from './Popover';

// SELECTORS
import { selectActivityGroup } from '../../../../Redux/ActivityGroup/activityGroup.selectors';

// STYLES
import './index.scss';

// TYPES
import { TActivity } from '../../../../Types/Activity.type';
import { TActivityGroup } from '../../../../Types/ActivityGroup.type';

type Props = {
  activity: TActivity,
};

const ActivityGroupSelector = ({ activity }: Props) => {
  const { formId }: { formId: string } = useParams();
  const selectedActivityGroup: TActivityGroup = useSelector(selectActivityGroup)(formId, activity.groupId);

  return (
    <Popover
      overlayClassName='activity-group-popover--wrapper'
      title="Group activity"
      content={<ActivityGroupPopover activity={activity} />}
      getPopupContainer={() => document.getElementById('te-prefs-lib') as HTMLElement}
      trigger='hover'
      placement='rightTop'
    >
      <div className="activity-group--button">
        <Button size="small" icon="appstore">
          {selectedActivityGroup ? selectedActivityGroup.name : 'N/A'}
        </Button>
      </div>
    </Popover>
  )
};
// <GroupingButton activityGroup={selectedActivityGroup} />
export default ActivityGroupSelector;