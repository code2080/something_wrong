import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DynamicTable from '../../Components/DynamicTable/DynamicTableHOC';
import { tableViews } from '../../Constants/tableViews.constants';

import { Collapse, Switch, InputNumber } from 'antd';
import './ConstraintManagerTable.scss';

const { Panel } = Collapse;

const constraintTableData = [
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
    render: (weight) => <InputNumber min={1} max={100} defaultValue={weight} />
  }
];

const ConstraintManagerTable = ({ renderSectionHeader, constraints }) => {
  return (
    <div className="constraint-manager--Table">
      <Collapse defaultActiveKey={['1']}>
        <Panel header={renderSectionHeader} key="1">
          <DynamicTable
            columns={constraintTableData}
            rowkey="_id"
            showFilter={false}
            dataSource={constraints}
            datasourceId={`${tableViews.CONSTRAINTS}`}
          />
        </Panel>
      </Collapse>
    </div>
  );
};

ConstraintManagerTable.propTypes = {
  renderSectionHeader: PropTypes.object,
  constraints: PropTypes.array
};

export default ConstraintManagerTable;
