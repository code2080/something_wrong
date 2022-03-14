import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

interface Props {
  conflictsResolved: boolean;
}

const JointTeachingGroupStatusCheck = (props: Props) => {
  const { conflictsResolved } = props;
  return conflictsResolved ? (
    <CheckCircleOutlined style={{ fontSize: 14 }} className='text--success' />
  ) : (
    <ExclamationCircleOutlined
      style={{ fontSize: 14 }}
      className='text--error'
    />
  );
};

export default JointTeachingGroupStatusCheck;
