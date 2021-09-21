import React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import JointTeachingGroup from 'Models/JointTeachingGroup.model';

interface Props {
  jointTeachingGroup: JointTeachingGroup;
}

const JointTeachingGroupStatusCheck = (props: Props) => {
  const { jointTeachingGroup } = props;
  console.log(jointTeachingGroup);
  return (
    <ExclamationCircleOutlined
      style={{ fontSize: 14 }}
      className='text--error'
    />
  );
};

export default JointTeachingGroupStatusCheck;
