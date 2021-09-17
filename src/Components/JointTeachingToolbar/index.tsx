import { Button, Divider } from 'antd';
import { Key } from 'react';

import JointTeachingFiltering from './components/JointTeachingFiltering';

type Props = {
  selectedRowKeys?: Key[];
  onSelectAll(): void;
  onDeselectAll(): void;
  onCreateJointTeachingMatch(): void;
  onAddJointTeachingMatch(): void;
};

const JointTeachingToolbar = ({
  selectedRowKeys,
  onSelectAll,
  onDeselectAll,
  onCreateJointTeachingMatch,
  onAddJointTeachingMatch,
}: Props) => {
  return (
    <div className='activities-toolbar--wrapper'>
      <span style={{ whiteSpace: 'nowrap' }}>
        Selected:&nbsp; {selectedRowKeys?.length ?? 0}
      </span>
      <Button size='small' type='link' onClick={onSelectAll}>
        Select all
      </Button>
      <Button
        size='small'
        type='link'
        disabled={!selectedRowKeys?.length}
        onClick={onDeselectAll}
      >
        Deselect all
      </Button>
      <Divider type='vertical' />
      <Button
        size='small'
        type='link'
        onClick={onCreateJointTeachingMatch}
        disabled={!selectedRowKeys?.length}
      >
        Create joint teaching match
      </Button>
      <Button
        size='small'
        type='link'
        onClick={onAddJointTeachingMatch}
        disabled={!selectedRowKeys?.length}
      >
        Add to joint teaching match
      </Button>
      <JointTeachingFiltering />
    </div>
  );
};

export default JointTeachingToolbar;
