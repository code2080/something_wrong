import React from 'react';
import PropTypes from 'prop-types';
import DynamicTable from '../../Components/DynamicTable/DynamicTableHOC';
import { tableViews } from '../../Constants/tableViews.constants';

import { Collapse } from 'antd';
import './ConstraintManagerTable.scss';
import constraintManagerTableColumns from './ConstraintManagerTableColumns';

const { Panel } = Collapse;
const ConstraintManagerTable = ({ renderSectionHeader, constraints }) => {
  return (
    <div className="constraint-manager--Table">
      <Collapse defaultActiveKey={['1']}>
        <Panel header={renderSectionHeader} key="1">
          <DynamicTable
            columns={constraintManagerTableColumns}
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
