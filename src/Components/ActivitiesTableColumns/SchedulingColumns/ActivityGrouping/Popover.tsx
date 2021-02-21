import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Input, Icon } from 'antd';

// SELECTORS
import { selectActivityGroupsForForm } from '../../../../Redux/ActivityGroup/activityGroup.selectors';

// ACTIONS
import { createActivityGroup } from '../../../../Redux/ActivityGroup/activityGroup.actions';

// TYPES
import { TActivityGroup } from '../../../../Types/ActivityGroup.type';
import { useState } from 'react';
import ActivityGroupListItem from './ListItem';
import GroupingButton from './Button';
import { TActivity } from '../../../../Types/Activity.type';

type Props = {
  activity: TActivity,
};

const ActivityGroupPopover = ({ activity }: Props) => {
  const dispatch = useDispatch();
  const { formId }: { formId: string } = useParams();
  const activityGroups: TActivityGroup[] = useSelector(selectActivityGroupsForForm)(formId);

  /**
   * STATE
   */
  const [filterQuery, setFilterQuery] = useState('');
  const [newGroupName, setNewGroupName] = useState('');

  /**
   * EVENT HANDLERS
   */
  const onCreateActivityGroup = () => {
    if (newGroupName && newGroupName.length > 0) {
      dispatch(createActivityGroup(formId, { name: newGroupName }));
      setNewGroupName('');
    }
  }
  return (
    <div className='activity-group--popover'>
      <div className="activity-group--row">
        <div className="header">Create new group:</div>
        <Input.Search
          placeholder="Activity group name"
          allowClear
          enterButton="Create"
          size="small"
          value={newGroupName}
          onChange={e => setNewGroupName(e.target.value)}
          onSearch={onCreateActivityGroup}
        />
      </div>
      <div className="activity-group--row">
        <div className="header">Select an existing group:</div>
        <Input
          placeholder='Select activity group'
          suffix={<Icon type='search' style={{ color: 'rgba(0,0,0,.45)' }} />}
          onChange={e => setFilterQuery(e.target.value)}
          size='small'
          value={filterQuery}
        />
        <div className="activity-group--list">
          {activityGroups
            .filter(activityGroup => activityGroup.name.toLowerCase().includes(filterQuery.toLowerCase()))
            .sort((a, b) => {
              if (a._id === activity.groupId) return -1;
              if (b._id === activity.groupId) return 1;
              return 0;
            })
            .map((activityGroup, i) => (
              <ActivityGroupListItem
                key={`idx-${i}`}
                activityId={activity._id}
                activityGroup={activityGroup}
                isSelected={activity.groupId === activityGroup._id}
              />
            )
          )}
        </div>
      </div>
    </div>
  )
};
// <GroupingButton activityGroup={selectedActivityGroup} />
export default ActivityGroupPopover;