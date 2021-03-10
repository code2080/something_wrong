import React from 'react';
import { Switch, InputNumber } from 'antd';

const constraintManagerTableColumns = (onUpdateValue) => [
  {
    title: 'Active',
    dataIndex: 'isActive',
    key: 'isActive',
    render: (isActive, ci) => (
      <Switch 
        checked={isActive}
        size="small"
        onChange={checked => onUpdateValue(ci.constraintId, 'isActive', checked)}
      />
    ),
  },
  {
    title: 'Name',
    dataIndex: 'constraint.name',
    key: 'name'
  },
  {
    title: 'Description',
    dataIndex: 'constraint.description',
    key: 'description'
  },
  {
    title: 'Parameters',
    dataIndex: 'parameters',
    key: 'parameters'
  },
  {
    title: 'Hard Constraint',
    dataIndex: 'isHardConstraint',
    key: 'isHardConstraint',
    render: (isHardConstraint) => (
      <Switch
        checked={isHardConstraint}
        size="small"
      />
    ),
  },
  {
    title: 'Weight',
    dataIndex: 'weight',
    key: 'weight',
    render: (weight, isHardConstraint) => (
      <InputNumber
        min={1}
        max={100}
        value={weight}
        disabled={!isHardConstraint}
        size="small"
      />
    )
  }
];

export default constraintManagerTableColumns;
