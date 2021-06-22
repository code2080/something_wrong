import { RiShareBoxFill } from 'react-icons/ri';
import { Button, Popover, Modal } from 'antd';
import { useState } from 'react';

const JointTeachingIcon = (jointTeachingProps) => {
  if (!jointTeachingProps) return;

  if (jointTeachingProps?.hasJointTeaching)
    return (
      <Popover content={'Click to indicate joint teaching'}>
        <Button
          style={{
            padding: 0,
            border: 'none',
            background: 'none',
          }}
          icon={<RiShareBoxFill size='large' />}
        ></Button>
      </Popover>
    );

  if (jointTeachingProps?.isMerged)
    return (
      <Button icon={<RiShareBoxFill size='large' color='green' />}></Button>
    );

  return (
    <Popover content={'Click to indicate joint teaching'}>
      <Button
        style={{
          padding: 0,
          border: 'none',
          background: 'none',
        }}
        icon={<RiShareBoxFill size='large' />}
      ></Button>
    </Popover>
  );
};

export default JointTeachingIcon;
