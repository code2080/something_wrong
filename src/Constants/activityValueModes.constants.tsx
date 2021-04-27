import { FormOutlined, UserOutlined } from '@ant-design/icons';

export enum ActivityValueMode {
  FROM_SUBMISSION = 'FROM_SUBMISSION',
  MANUAL = 'MANUAL',
}

export const activityValueModeProps = {
  [ActivityValueMode.FROM_SUBMISSION]: {
    label: 'From submission',
    icon: <FormOutlined />,
  },
  [ActivityValueMode.MANUAL]: {
    label: 'Manual',
    icon: <UserOutlined />,
  },
};
