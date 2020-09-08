import React from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import DynamicTable from '../DynamicTable/DynamicTableHOC';
import ExpandedPane from '../TableColumns/Components/ExpandedPane';

// STYLES
import './BaseSectionTableView.scss';

// CONSTANTS
import { tableViews } from '../../Constants/tableViews.constants';

const BaseSectionTableView = ({ sectionId, columns, dataSource }) => (
  <DynamicTable
    columns={columns}
    dataSource={dataSource}
    rowKey="rowKey"
    pagination={false}
    expandedRowRender={row => <ExpandedPane columns={columns} row={row} />}
    datasourceId={`${tableViews.SECTION}-${sectionId}`}
  />
);

BaseSectionTableView.propTypes = {
  sectionId: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
};

export default BaseSectionTableView;
