/* eslint-disable react/prop-types */
import React from 'react';
import { Switch, InputNumber } from 'antd';

const getPropFromConstraint = (constraintId, prop, allConstraints) => {
  const constraint = allConstraints.find(el => el.constraintId === constraintId);
  if (!constraint || !constraint[prop]) return 'N/A';
  return constraint[prop];
};

const constraintManagerTableColumns = (onUpdateValue, allConstraints) => [
  {
    title: 'Active',
    dataIndex: 'isActive',
    key: 'isActive',
    render: (isActive, ci) => (
      <Switch
        checked={isActive}
        size='small'
        onChange={checked => onUpdateValue(ci.constraintId, 'isActive', checked)}
      />
    ),
  },
  {
    title: 'Name',
    dataIndex: 'constraintId',
    key: 'name',
    render: constraintId => getPropFromConstraint(constraintId, 'name', allConstraints),
  },
  {
    title: 'Description',
    dataIndex: 'constraintId',
    key: 'description',
    render: constraintId => getPropFromConstraint(constraintId, 'description', allConstraints),
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
    render: (isHardConstraint, ci) => (
      <Switch
        checked={isHardConstraint}
        size='small'
        onChange={checked => onUpdateValue(ci.constraintId, 'isHardConstraint', checked)}
      />
    ),
  },
  {
    title: 'Weight',
    dataIndex: undefined,
    key: 'weight',
    render: ({ constraintId, weight, isHardConstraint }) => (
      <InputNumber
        min={1}
        max={100}
        value={weight}
        disabled={isHardConstraint}
        size='small'
        onChange={val => onUpdateValue(constraintId, 'weight', val)}
      />
    )
  }
];

export default constraintManagerTableColumns;
