import { useSelector } from 'react-redux';
import { Popover, Button } from 'antd';
import { useParams } from 'react-router-dom';
import { AppstoreOutlined } from '@ant-design/icons';

// COMPONENTS
import ActivityTagPopover from './Popover';
// SELECTORS
import { selectActivityTag } from '../../../../Redux/ActivityTag/activityTag.selectors';

// STYLES
import './index.scss';

// TYPES
import { TActivity } from '../../../../Types/Activity.type';
import { TActivityTag } from '../../../../Types/ActivityTag.type';

type Props = {
  activities: TActivity[];
};

const ActivityTagSelector = ({ activities }: Props) => {
  const { formId }: { formId: string } = useParams();
  const selectedActivityTag: TActivityTag | null = useSelector(
    selectActivityTag,
  )(formId, activities[0].tagId);

  return (
    <div className='activity-tag'>
      <Popover
        overlayClassName='activity-tag-popover--wrapper'
        title='Tag activity'
        content={<ActivityTagPopover activities={activities} />}
        getPopupContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
        trigger='hover'
        placement='rightTop'
      >
        <div className='activity-tag--button'>
          <Button size='small' icon={<AppstoreOutlined />}>
            {selectedActivityTag ? selectedActivityTag.name : 'N/A'}
          </Button>
        </div>
      </Popover>
    </div>
  );
};
// <GroupingButton activityGroup={selectedActivityGroup} />
export default ActivityTagSelector;
