import { ShareAltOutlined } from '@ant-design/icons';
import { Space } from 'antd';

type Props = {
  trackNumber: number;
};

const ActivityTrack = ({ trackNumber }: Props) =>
  !isNaN(trackNumber) ? (
    <Space>
      <ShareAltOutlined />
      {trackNumber}
    </Space>
  ) : <div style={{ textAlign: 'center' }}>--</div>;

export default ActivityTrack;
