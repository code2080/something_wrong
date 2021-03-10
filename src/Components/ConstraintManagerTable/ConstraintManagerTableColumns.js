import React from 'react';
import { Switch, InputNumber } from 'antd';

const constraintManagerTableColumns = [
  {
    title: 'Active',
    dataIndex: 'isActive',
    key: 'isActive',
    render: (isActive) => <Switch defaultChecked={isActive} />
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
    render: (isHardConstraint) => <Switch defaultChecked={isHardConstraint} />
  },
  {
    title: 'Weight',
    dataIndex: 'weight',
    key: 'weight',
    render: (weight, isHardConstraint) => (
      <InputNumber
        min={1}
        max={100}
        defaultValue={weight}
        disabled={!isHardConstraint}
      />
    )
  }
];

export default constraintManagerTableColumns;
