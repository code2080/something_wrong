import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

// SELECTORS
import { selectActivityGroupsForForm } from '../../../../Redux/ActivityGroup/activityGroup.selectors';

// ACTIONS
import { createActivityGroup } from '../../../../Redux/ActivityGroup/activityGroup.actions';

// TYPES
import { TActivityGroup } from '../../../../Types/ActivityGroup.type';

import ActivityGroupListItem from './ListItem';
import { TActivity } from '../../../../Types/Activity.type';

type Props = {
  activities: TActivity[];
};

const ActivityGroupPopover = ({ activities }: Props) => {
  const dispatch = useDispatch();
  const { formId }: { formId: string } = useParams();
  const activityGroups: TActivityGroup[] = useSelector(
    selectActivityGroupsForForm,
  )(formId);

  /**
   * MEMOIZED PROPS
   */
  const selectedActivityGroupId = useMemo(() => {
    if (!activities || !activities.length) return null;
    // Need to first check if all activities are on the same activity group
    const hasSameGroupValue = activities.every((a) =>
      activities.every((b) => b.groupId === a.groupId),
    );
    if (hasSameGroupValue) return activities[0].groupId;
    return null;
  }, [activities]);

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
  };
  return (
    <div className='activity-group--popover'>
      <div className='activity-group--row'>
        <div className='header'>Create new group:</div>
        <Input.Search
          placeholder='Activity group name'
          allowClear
          enterButton='Create'
          size='small'
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          onSearch={onCreateActivityGroup}
        />
      </div>
      <div className='activity-group--row'>
        <div className='header'>Select an existing group:</div>
        <Input
          placeholder='Select activity group'
          suffix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
          onChange={(e) => setFilterQuery(e.target.value)}
          size='small'
          value={filterQuery}
        />
        <div className='activity-group--list'>
          {activityGroups
            .filter((activityGroup) =>
              activityGroup.name
                .toLowerCase()
                .includes(filterQuery.toLowerCase()),
            )
            .map((activityGroup, i) => (
              <ActivityGroupListItem
                key={`idx-${i}`}
                activityIds={activities.map((el) => el._id)}
                activityGroup={activityGroup}
                isSelected={selectedActivityGroupId === activityGroup._id}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
// <GroupingButton activityGroup={selectedActivityGroup} />
export default ActivityGroupPopover;
