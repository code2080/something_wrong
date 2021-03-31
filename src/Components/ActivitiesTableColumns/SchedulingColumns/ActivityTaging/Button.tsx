import { Button } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';

// TYPES
import { TActivity } from '../../../../Types/Activity.type';
type Props = {
  activity: TActivity;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GroupingButton = ({ activity }: Props) => {
  return (
    <Button size='small' icon={<AppstoreOutlined />}>
      N/A
    </Button>
  );
};

export default GroupingButton;
