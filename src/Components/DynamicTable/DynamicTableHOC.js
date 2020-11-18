import React, { useState, useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { withResizeDetector } from 'react-resize-detector';

// COMPONENTS
import { columnModifierColumn } from './ColumnModifierColumn';
import ColumnSelector from './ColumnSelector';
import FilterBar from './FilterBar';
import ResizableHeaderCell from './ResizableHeaderCell';
import EllipsisTruncater from '../TableColumns/Components/EllipsisTruncater';

// ACTIONS
import { initView, getView, updateView } from '../../Redux/GlobalUI/globalUI.actions';

// STYLES
import './DynamicTable.scss';

// CONSTANTS
const mapStateToProps = (state, { datasourceId }) => ({
  visibleCols: state.globalUI.tableViews[datasourceId] || {},
});

const mapActionsToProps = {
  initView,
  getView,
  updateView,
};

const DynamicTableHOC = ({
  columns,
  dataSource,
  rowKey,
  onRow,
  expandedRowRender,
  pagination,
  isLoading,
  width,
  showFilter,
  datasourceId,
  visibleCols,
  initView,
  getView,
  updateView,
  resizable,
}) => {
  // Assuming that the key is most likely to be persistent, if not defined, fallback on title
  const visibilityIndexor = column => column.key || column.title;
  const isVisibleCol = column => {
    const visibleByIndexor = visibleCols[visibilityIndexor(column)];
    const visibleByTitle = visibleCols[column.title];

    if (visibleByIndexor !== undefined) return visibleByIndexor;
    return visibleByTitle === undefined ? true : visibleByTitle;
  };

  // Effect to load stored views
  useEffect(() => {
    getView(datasourceId);
  }, []);

  // Effect to update cols everytime columns change
  useEffect(() => {
    initView(datasourceId, columns.reduce((colState, col) => ({ ...colState, [visibilityIndexor(col)]: true }), {}));
  }, []);

  // State to hold whether column selection should be visible or not
  const [showColumnSelection, setShowColumnSelection] = useState(false);

  // State to hold columns width
  const [columnWidth, setColumnWidth] = useState(Object.values(columns).map(col => col.fixedWidth || col.width));

  // State variable to hold filter query
  const [filterQuery, setFilterQuery] = useState('');

  // Memoized calculated width
  const fixedWidthCols = useMemo(() => columns.filter(col => isVisibleCol(col) && col.fixedWidth), [columns, visibleCols]);

  const _width = useMemo(() => {
    // Get the visible columns
    const fixedWidth = fixedWidthCols
      .reduce((tot, col) => col.fixedWidth ? tot + col.fixedWidth : tot, 0);
    const constant = expandedRowRender ? 90 : 40;
    return width ? width - (fixedWidth + constant) : 0;
  }, [fixedWidthCols, width]);

  // Memoized variable with the visible column definitions
  const _cols = useMemo(
    () =>
      columns
        .filter(col => isVisibleCol(col))
        .map((col, idx, arr) => ({
          ...col,
          width: columnWidth[idx] ? columnWidth[idx] : (_width / (arr.length - fixedWidthCols.length)),
          onHeaderCell: column => ({
            resizable: resizable && col.resizable !== false,
            width: columnWidth[idx] ? columnWidth[idx] : (_width / (arr.length - fixedWidthCols.length)),
            title: col.title,
            index: idx,
            expandable: !!expandedRowRender,
            onResized: (changedWidth) => {
              setColumnWidth([
                ...columnWidth.slice(0, idx),
                changedWidth ,
                ...columnWidth.slice(idx + 1),
              ]);
            }
          }),
          render:
            (val, el) =>
              col.render
                ? <EllipsisTruncater width={columnWidth[idx] ? columnWidth[idx] : (_width / (arr.length - fixedWidthCols.length))}>{col.render(val, el)}</EllipsisTruncater>
                : <EllipsisTruncater width={columnWidth[idx] ? columnWidth[idx] : (_width / (arr.length - fixedWidthCols.length))}>{val}</EllipsisTruncater>,
        })),
    [columns, visibleCols, _width, columnWidth, expandedRowRender]
  );

  // If there are no accessors defined for the filter, we do not want to show filter bar at all
  const _showFilter = showFilter && _cols.some(({dataIndex, filterFn }) => dataIndex || filterFn); 

  // Memoized datasource filtered on filter query
  const _dataSource = useMemo(() => {
    if (filterQuery === '' || filterQuery.length < 3) return dataSource;
    // Filter data source by iterating over each of the visible columns and determine if one of them contains the query
    return dataSource.filter(
      el => _cols
        .some(
          col => {
            const { dataIndex, filterFn } = col;
            const filterVal = (filterFn && filterFn(el)) || el[dataIndex];
            if (!filterVal) return false;
            return filterVal
              .toString()
              .toLowerCase()
              .includes(
                filterQuery
                  .toString()
                  .toLowerCase()
              )
          })
    );
  }, [filterQuery, dataSource, _cols]);

  return (
    <div
      className="dynamic-table--wrapper"
    >
      {showColumnSelection ? (
        <ColumnSelector
          columns={columns.map(col => [
            visibilityIndexor(col),
            isVisibleCol(col),
            col.title
          ])}
          onColumnStateChange={({ colIndex, newVisibility }) => updateView(datasourceId, { ...visibleCols, [colIndex]: newVisibility })}
          onHide={() => setShowColumnSelection(false)}
        />
      ) : (
        <React.Fragment>
          {_showFilter && <FilterBar query={filterQuery} onChange={newFilterQuery => setFilterQuery(newFilterQuery)} />}
          <Table
            components={{
              header: {
                cell: ResizableHeaderCell,
              },
            }}
            columns={[..._cols, columnModifierColumn(() => setShowColumnSelection(true))]}
            dataSource={_dataSource}
            rowKey={rowKey}
            expandedRowRender={expandedRowRender || null}
            pagination={pagination}
            loading={isLoading}
            sortDirections={['descend', 'ascend']}
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
  expandedRowRender: PropTypes.func,
  isLoading: PropTypes.bool,
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  width: PropTypes.number,
  showFilter: PropTypes.bool,
  datasourceId: PropTypes.string.isRequired,
  visibleCols: PropTypes.object,
  initView: PropTypes.func.isRequired,
  getView: PropTypes.func.isRequired,
  updateView: PropTypes.func.isRequired,
  resizable: PropTypes.bool,
};

DynamicTableHOC.defaultProps = {
  columns: [],
  dataSource: [],
  rowKey: '_id',
  onRow: null,
  isLoading: false,
  expandedRowRender: null,
  pagination: {
    size: 'small',
    showSizeChanger: true,
  },
  width: null,
  showFilter: true,
  visibleCols: {},
  resizable: false,
};

export default withResizeDetector(connect(mapStateToProps, mapActionsToProps)(DynamicTableHOC));
