import { Popover, Button } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';

import { TActivity } from '../../../../Types/Activity/Activity.type';
import './index.scss';

type Props = {
  activity: TActivity;
};

const ActivityTracksSelector = ({ activity }: Props) => {
  return (
    <div className='activity-tag'>
      <Popover
        overlayClassName='activity-tag-popover--wrapper'
        title='Tracks'
        content={activity.tracks ? activity.tracks : 0}
        getPopupContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
        trigger='hover'
        placement='rightTop'
      >
        <div className='activity-tag--button'>
          <Button size='small' icon={<AppstoreOutlined />}>
            {'N/A'}
          </Button>
        </div>
      </Popover>
    </div>
  );
};
export default ActivityTracksSelector;
