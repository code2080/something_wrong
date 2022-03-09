import { useSelector } from 'react-redux';
import { Popover, Button } from 'antd';
import { useParams } from 'react-router-dom';

// COMPONENTS
import ActivityTagPopover from './Popover';

// REDUX
import { selectActivityTag } from '../../../../Redux/ActivityTag/activityTag.selectors';

// STYLES
import './index.scss';

// TYPES
import { TActivity } from '../../../../Types/Activity.type';

type Props = {
  activity: TActivity;
};

const ActivityTagSelector = ({ activity }: Props) => {
  const { formId } = useParams<{ formId: string }>();
  const selectedActivityTag = useSelector(selectActivityTag)(
    formId,
    activity.tagId,
  );

  return (
    <div className='activity-tag'>
      <Popover
        overlayClassName='activity-tag-popover--wrapper'
        title='Tag activity'
        content={
          <ActivityTagPopover
            selectedActivityIds={[activity._id]}
            selectedTagId={selectedActivityTag?._id}
          />
        }
        getPopupContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
        trigger='hover'
        placement='rightTop'
      >
        <div className='activity-tag--button'>
          <Button size='small'>
            {selectedActivityTag ? selectedActivityTag.name : 'N/A'}
          </Button>
        </div>
      </Popover>
    </div>
  );
};

export default ActivityTagSelector;
