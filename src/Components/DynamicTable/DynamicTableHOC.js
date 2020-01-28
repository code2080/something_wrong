import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Table } from 'antd';

// COMPONENTS
import { columnModifierColumn } from './ColumnModifierColumn';
import ColumnSelector from './ColumnSelector';
import FilterBar from './FilterBar';

const DynamicTableHOC = ({ columns, dataSource, rowKey, history, onRow }) => {
  // State to hold whether column selection should be visible or not
  const [showColumnSelection, setShowColumnSelection] = useState(false);
  // State variable to hold which columns should be shown
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((colState, col) => ({ ...colState, [col.title]: true }), {})
  );
  // State variable to hold filter query
  const [filterQuery, setFilterQuery] = useState('');
  // Memoized variable with the visible column definitions
  const _cols = useMemo(() => columns.filter(col => visibleColumns[col.title]), [columns, visibleColumns]);
  // Memoized datasource filtered on filter query
  const _dataSource = useMemo(() => {
    if (filterQuery === '' || filterQuery.length < 3) return dataSource;
    // Filter data source by iterating over each of the visible columns and determine if one of them contains the query
    return dataSource.filter(
      el => _cols
        .some(
          col => {
            if (!el[col.dataIndex]) return false;
            return el[col.dataIndex]
              .toString()
              .toLowerCase()
              .indexOf(
                filterQuery
                  .toString()
                  .toLowerCase()
              ) > -1
          })
    );
  }, [filterQuery, dataSource, _cols]);

  return (
    <React.Fragment>
      {showColumnSelection ? (
        <ColumnSelector
          columnState={visibleColumns}
          onColumnStateChange={newColState => setVisibleColumns(newColState)}
          onHide={() => setShowColumnSelection(false)}
        />
      ) : (
        <React.Fragment>
          <FilterBar query={filterQuery} onChange={newFilterQuery => setFilterQuery(newFilterQuery)} />
          <Table
            columns={[ ..._cols, columnModifierColumn(() => setShowColumnSelection(true)) ]}
            dataSource={_dataSource}
            rowKey={rowKey}
            onRow={onRow}
            pagination={{
              size: 'small',
              pageSize: 50
            }}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  )
};

DynamicTableHOC.propTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  rowKey: PropTypes.string,
  history: PropTypes.object.isRequired,
  onRow: PropTypes.func,
};

DynamicTableHOC.defaultProps = {
  columns: [],
  dataSource: [],
  rowKey: '_id',
};

export default withRouter(DynamicTableHOC);
