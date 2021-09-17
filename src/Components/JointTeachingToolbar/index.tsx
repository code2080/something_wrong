import { Button, Divider } from 'antd';
import { Key } from 'react';

import JointTeachingFiltering from './components/JointTeachingFiltering';

type Props = {
  selectedRowKeys?: Key[];
  onSelectAll(): void;
  onDeselectAll(): void;
  onCreateJointTeachingMatch(): void;
  onAddJointTeachingMatch(): void;
  tableType: string;
};

const JointTeachingToolbar = ({
  selectedRowKeys,
  onSelectAll,
  onDeselectAll,
  onCreateJointTeachingMatch,
  onAddJointTeachingMatch,
  tableType,
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
        disabled={!selectedRowKeys?.length}
        onClick={onCreateJointTeachingMatch}
      >
        Create joint teaching match
      </Button>
      <Button
        size='small'
        type='link'
        disabled={!selectedRowKeys?.length}
        onClick={onAddJointTeachingMatch}
      >
        Add to joint teaching match
      </Button>
      <JointTeachingFiltering tableType={tableType} />
    </div>
  );
};

export default JointTeachingToolbar;
