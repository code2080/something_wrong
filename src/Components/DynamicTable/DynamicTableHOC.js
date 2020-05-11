import React, { useState, useMemo, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { withResizeDetector } from 'react-resize-detector';

// COMPONENTS
import { columnModifierColumn } from './ColumnModifierColumn';
import ColumnSelector from './ColumnSelector';
import FilterBar from './FilterBar';
import ResizableColumnHeader from './ResizableColumnHeader';
import EllipsisTruncater from '../TableColumns/Components/EllipsisTruncater';

const DynamicTableHOC = ({
  columns,
  dataSource,
  rowKey,
  onRow,
  pagination,
  isLoading,
  width,
}) => {
  // State var to hold the columns
  const [cols, setCols] = useState([]);

  // Memoized calculated width
  const _width = useMemo(() => width ? width - 40 : 0, [width]);

  // Effect to update cols everytime columnns change
  useEffect(() => {
    setCols(columns);
  }, [columns]);

  // State to hold whether column selection should be visible or not
  const [showColumnSelection, setShowColumnSelection] = useState(false);

  // State variable to hold which columns should be shown
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((colState, col) => ({ ...colState, [col.title]: true }), {})
  );

  // State variable to hold filter query
  const [filterQuery, setFilterQuery] = useState('');

  // Memoized variable with the visible column definitions
  const _cols = useMemo(
    () =>
      cols
        .filter(col => visibleColumns[col.title])
        .map((col, idx, arr) => ({
          ...col,
          width: _width / arr.length,
          onHeaderCell: column => ({
            width: column.width,
          }),
          render:
            (val, el) =>
              col.render
                ? <EllipsisTruncater width={_width / arr.length}>{col.render(val, el)}</EllipsisTruncater>
                : <EllipsisTruncater width={_width / arr.length}>{val}</EllipsisTruncater>,
        })),
    [cols, visibleColumns, _width]
  );

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
    <div
      className="dynamic-table--wrapper"
    >
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
            components={{
              header: {
                cell: ResizableColumnHeader,
              },
            }}
            columns={[ ..._cols, columnModifierColumn(() => setShowColumnSelection(true)) ]}
            dataSource={_dataSource}
            rowKey={rowKey}
            pagination={pagination}
            loading={isLoading}
            onRow={onRow || null}
          />
        </React.Fragment>
      )}
    </div>
  )
};

DynamicTableHOC.propTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  rowKey: PropTypes.string,
  onRow: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  isLoading: PropTypes.bool,
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  width: PropTypes.number,
};

DynamicTableHOC.defaultProps = {
  columns: [],
  dataSource: [],
  rowKey: '_id',
  onRow: null,
  isLoading: false,
  pagination: {
    size: 'small',
    showSizeChanger: true,
  },
  width: null,
};

export default withResizeDetector(DynamicTableHOC);
