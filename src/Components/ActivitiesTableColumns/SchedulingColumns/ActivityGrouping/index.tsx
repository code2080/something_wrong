import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Popover, Button } from 'antd';
import { useParams } from 'react-router-dom';
import { AppstoreOutlined } from '@ant-design/icons';

// COMPONENTS
import ActivityGroupPopover from './Popover';
// SELECTORS
import { selectActivityGroup } from '../../../../Redux/ActivityGroup/activityGroup.selectors';
import { setActivityFilterOptions } from '../../../../Redux/Filters/filters.actions';

// STYLES
import './index.scss';

// TYPES
import { EActivityFilterType } from '../../../../Types/ActivityFilter.interface';
import { TActivity } from '../../../../Types/Activity.type';
import { TActivityGroup } from '../../../../Types/ActivityGroup.type';

type Props = {
  activities: TActivity[],
};

const ActivityGroupSelector = ({ activities }: Props) => {
  const dispatch = useDispatch();
  const { formId }: { formId: string } = useParams();
  const selectedActivityGroup: TActivityGroup = useSelector(selectActivityGroup)(formId, activities[0].groupId);

  const formattedValue = selectedActivityGroup ? selectedActivityGroup.name : 'N/A';
  /*
  useEffect(() => {
    if (activities && activities.length === 1)
      dispatch(setActivityFilterOptions({
        filterId: `${formId}_ACTIVITIES`,
        optionType: EActivityFilterType.FIELD,
        optionPayload: { extId: 'groupId', values: [{ value: `groupId/${formattedValue}`, label: formattedValue }] },
        activityId: activities[0]._id,
      }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */
  return (
    <Popover
      overlayClassName='activity-group-popover--wrapper'
      title='Group activity'
      content={<ActivityGroupPopover activities={activities} />}
      getPopupContainer={() => document.getElementById('te-prefs-lib') as HTMLElement}
      trigger='hover'
      placement='rightTop'
    >
      <div className='activity-group--button'>
        <Button size='small' icon={<AppstoreOutlined />}>
          {selectedActivityGroup ? selectedActivityGroup.name : 'N/A'}
        </Button>
      </div>
    </Popover>
  );
};
// <GroupingButton activityGroup={selectedActivityGroup} />
export default ActivityGroupSelector;
