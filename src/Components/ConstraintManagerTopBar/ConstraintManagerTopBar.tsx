
import React from 'react';
import { Select, Button, Typography, Popconfirm } from 'antd';


// STYLES
import './ConstraintManagerTopBar.scss';

// TYPES
import { TConstraintConfiguration } from '../../Types/ConstraintConfiguration.type';

type Props = {
  constraintConfigurations: TConstraintConfiguration[];
  selectedCID: string | null | undefined;
  selConstrName: string | null | undefined;
  onUpdConstrConfName: (value: string) => void;
  onSelect: (cid: string) => void;
  onCreateNew: () => void;
  onDeleteConstraintConfiguration: () => void;
  onSaveConstraintConfiguration: () => void;
};

const { Paragraph } = Typography;

const ConstraintManagerTopBar = ({
  onSelect,
  onCreateNew,
  onUpdConstrConfName,
  constraintConfigurations,
  selectedCID,
  selConstrName,
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
        <Paragraph
          editable={{
            onChange: onUpdConstrConfName,
          }}
        >
          {selConstrName}
        </Paragraph>
        <Popconfirm
          title='Are you sure you want to delete the configuration?'
          placement='top'
          onConfirm={onDeleteConstraintConfiguration}
          okText='Yes'
          cancelText='No'
          getPopupContainer={() =>
            document.getElementById('te-prefs-lib') as HTMLElement
          }
          trigger={'click'}
        >
          <Button size='small'>Delete</Button>
        </Popconfirm>
        <Button size='small' onClick={onSaveConstraintConfiguration}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default ConstraintManagerTopBar;
