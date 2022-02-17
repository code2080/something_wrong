import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

// SELECTORS
import { selectActivityTagsForForm } from '../../../../Redux/ActivityTag/activityTag.selectors';

// ACTIONS
import { createActivityTag } from '../../../../Redux/ActivityTag/activityTag.actions';

// TYPES
import { TActivityTag } from '../../../../Types/ActivityTag.type';

import ActivityTagListItem from './ListItem';

type Props = {
  selectedActivityIds: string[];
  selectedTagId?: string | null;
};

const ActivityTagPopover = ({ selectedActivityIds, selectedTagId }: Props) => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();
  const activityTags: TActivityTag[] = useSelector(selectActivityTagsForForm)(
    formId,
  );

  /*
   * STATE
   */
  const [filterQuery, setFilterQuery] = useState('');
  const [newTagName, setNewTagName] = useState('');

  /*
   * EVENT HANDLERS
   */
  const onCreateActivityTag = (name: string) => {
    if (name.trim()) {
      dispatch(createActivityTag(formId, { name: newTagName }));
      setNewTagName('');
    }
  };
  return (
    <div className='activity-tag--popover'>
      <div className='activity-tag--row'>
        <div className='header'>Create new tag:</div>
        <Input.Search
          placeholder='Activity tag name'
          allowClear
          enterButton='Create'
          size='small'
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onSearch={onCreateActivityTag}
        />
      </div>
      <div className='activity-tag--row'>
        <div className='header'>Select an existing tag:</div>
        <Input
          placeholder='Select activity tag'
          suffix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
          onChange={(e) => setFilterQuery(e.target.value)}
          size='small'
          value={filterQuery}
        />
        <div className='activity-tag--list'>
          {activityTags
            .filter((activityTag) =>
              activityTag.name
                .toLowerCase()
                .includes(filterQuery.toLowerCase()),
            )
            .map((activityTag, i) => (
              <ActivityTagListItem
                key={`idx-${i}`}
                activityIds={selectedActivityIds}
                activityTag={activityTag}
                isSelected={selectedTagId === activityTag._id}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
// <GroupingButton activityGroup={selectedActivityGroup} />
export default ActivityTagPopover;
