import React from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import DynamicTable from '../DynamicTable/DynamicTableHOC';

// STYLES
import './BaseSectionTableView.scss';

// CONSTANTS
import { tableViews } from '../../Constants/tableViews.constants';

const ExpandedPane = ({ columns, row }) => (
  <div className="base-section--expanded__wrapper">
    {(columns || [])
      .filter(col => !col.hideInList)
      .map(col => (
        <div className="base-section--expanded--item" key={col.dataIndex}>
          <div className="title">{col.title}:</div>
          <div className="value">{col.render(row[col.dataIndex])}</div>
        </div>
      ))}
  </div>
);

ExpandedPane.propTypes = {
  columns: PropTypes.array.isRequired,
  row: PropTypes.object.isRequired,
};

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
