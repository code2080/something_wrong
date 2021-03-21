import React from 'react';
import { Select, Button } from 'antd';

// STYLES
import './ConstraintManagerTopBar.scss';

// TYPES
import { TConstraintConfiguration } from '../../Types/ConstraintConfiguration.type';

type Props = {
  constraintConfigurations: TConstraintConfiguration[];
  selectedCID: string | null | undefined;
  onSelect: (cid: string) => void;
  onCreateNew: () => void;
  onDeleteConstraintConfiguration: () => void;
  onSaveConstraintConfiguration: () => void;
};

const ConstraintManagerTopBar = ({
  onSelect,
  onCreateNew,
  constraintConfigurations,
  selectedCID,
  onDeleteConstraintConfiguration,
  onSaveConstraintConfiguration,
}: Props) => {
  return (
    <div className='constraint-manager-top-bar--wrapper'>
      <div className='constraint-manager-top-bar--selections'>
        <span>Select constraint configuration: </span>
        <Select
          onChange={(cid: string) => onSelect(cid)}
          value={selectedCID || undefined}
          getPopupContainer={() =>
            document.getElementById('te-prefs-lib') as HTMLElement
          }
          size='small'
          placeholder='Select a constraint configuration'
          style={{ width: '200px' }}
        >
          {constraintConfigurations.map((conf) => (
            <Select.Option key={conf._id} value={conf._id as string}>
              {conf.name}
            </Select.Option>
          ))}
        </Select>
        <Button size='small' type='link' onClick={onCreateNew}>
          Create new...
        </Button>
      </div>
      <div className='constraint-manager-top-bar--buttons'>
        <Button size='small' onClick={onDeleteConstraintConfiguration}>
          Delete
        </Button>
        <Button size='small' onClick={onSaveConstraintConfiguration}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default ConstraintManagerTopBar;
