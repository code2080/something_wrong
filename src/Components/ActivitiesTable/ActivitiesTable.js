import React from 'react';
import PropTypes from 'prop-types';

// COMPONENtS
import DynamicTable from '../DynamicTable/DynamicTableHOC';

// HELPERS
import { createActivitiesTableColumnsFromMapping } from '../ActivitiesTableColumns/ActivitiesTableColumns';

// CONSTANTS
import { tableViews } from '../../Constants/tableViews.constants';

const ExpandedPane = ({ columns, row }) => {
  console.log(row);
  return (
    <div className="dynamic-table--expanded__wrapper">
      {(columns || [])
        .filter(col => !col.hideInList && col.title && col.title !== '')
        .map(col => {
          console.log(col);
          return (
            <div className="dynamic-table--expanded--item" key={col.dataIndex}>
              <div className="title">{col.title}:</div>
              <div className="value">{col.render(null, row)}</div>
            </div>
          );
        })}
    </div>
  );
};

ExpandedPane.propTypes = {
  columns: PropTypes.array.isRequired,
  row: PropTypes.object.isRequired,
};

const ActivitiesTable = ({
  formInstanceId,
  mapping,
  activities,
}) => {
  const columns = mapping ? createActivitiesTableColumnsFromMapping(mapping) : [];
  const dataSource = activities && activities.length ? activities : [];
  return (
    <DynamicTable
      columns={columns}
      dataSource={dataSource}
      rowKey="_id"
      datasourceId={`${tableViews.ACTIVITIES}-${formInstanceId}`}
      expandedRowRender={row => <ExpandedPane columns={columns} row={row} />}
    />
  );
};

ActivitiesTable.propTypes = {
  formInstanceId: PropTypes.string.isRequired,
  mapping: PropTypes.object,
  activities: PropTypes.array
};

ActivitiesTable.defaultProps = {
  mapping: null,
  activities: []
};

export default ActivitiesTable;
