import { useSelector } from 'react-redux';
import { Popover, Button } from 'antd';
import { useParams } from 'react-router-dom';
import { AppstoreOutlined } from '@ant-design/icons';

import { selectActivityTag } from '../../../../Redux/ActivityTag/activityTag.selectors';

import { TActivity } from '../../../../Types/Activity.type';
import ActivityTagPopover from './Popover';
import './index.scss';

type Props = {
  activity: TActivity;
};

const ActivityTagSelector = ({ activity }: Props) => {
  const { formId }: { formId: string } = useParams();
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
