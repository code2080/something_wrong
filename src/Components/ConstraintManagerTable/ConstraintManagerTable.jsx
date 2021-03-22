import PropTypes from 'prop-types';
import DynamicTable from '../DynamicTable/DynamicTableHOC';
import { tableViews } from '../../Constants/tableViews.constants';

import { Collapse } from 'antd';
import './ConstraintManagerTable.scss';
import constraintManagerTableColumns from './ConstraintManagerTableColumns';

const ConstraintManagerTable = ({ renderSectionHeader, constraints }) => {
  return (
    <div className='constraint-manager--Table'>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header={renderSectionHeader} key='1'>
          <DynamicTable
            columns={constraintManagerTableColumns}
            rowkey='_id'
            showFilter={false}
            dataSource={constraints}
            datasourceId={`${tableViews.CONSTRAINTS}`}
          />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

ConstraintManagerTable.propTypes = {
  renderSectionHeader: PropTypes.object,
  constraints: PropTypes.array,
};

export default ConstraintManagerTable;
