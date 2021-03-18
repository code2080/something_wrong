import React, { useState, useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { withResizeDetector } from 'react-resize-detector';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// COMPONENTS
import { columnModifierColumn } from './ColumnModifierColumn';
import ColumnSelector from './ColumnSelector';
import FilterBar from './FilterBar';

// ACTIONS
import {
  initView,
  getView,
  updateView,
} from '../../Redux/GlobalUI/globalUI.actions';

// STYLES
import './DynamicTable.scss';

// HELPERS
import {
  getVisibilityIndexor,
  isColumnVisible,
  getFixedWidthCols,
  getTotalAvailableWidth,
  getColumnObjectArrayForTable,
  shouldShowFilterBar,
  filterDataSource,
  getTableComponents,
} from './helpers';
import { useHistory } from 'react-router-dom';

const COLUMNS_WIDTH = 'COLUMNS_WIDTH';

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
  className,
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
  draggable,
  onSearch,
  onMove,
  rowSelection,
}) => {
  const history = useHistory();
  /**
   * STATE
   */
  // State to hold whether column selection should be visible or not
  const [showColumnSelection, setShowColumnSelection] = useState(false);

  // State to hold columns width
  // const [columnWidths, setColumnWidths] = useState([]);
  const [columnWidths, setColumnWidths] = useState([]);

  // State variable to hold filter query
  const [filterQuery, setFilterQuery] = useState('');
  /**
   * EFFECTS
   */
  // Effect to load stored views
  useEffect(() => {
    getView(datasourceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleColumnsKey = useMemo(() => {
    return Object.keys(visibleCols).filter((key) => visibleCols[key]);
  }, [visibleCols]);

  // Save to sessionStorage after columnWidths is changed
  useEffect(() => {
    let initialColumnsWidth;
    try {
      const savedWidths = JSON.parse(
        sessionStorage.getItem(COLUMNS_WIDTH).split(','),
      );
      initialColumnsWidth = visibleColumnsKey.map((key) => savedWidths[key]);
    } catch (error) {
      initialColumnsWidth = columns
        .filter((col) => isColumnVisible(col, visibleCols))
        .map((col) => col.fixedWidth || col.width);
    }
    setColumnWidths(
      visibleColumnsKey.reduce((results, key, keyIndex) => {
        return {
          ...results,
          [key]: isNaN(initialColumnsWidth[keyIndex])
            ? null
            : initialColumnsWidth[keyIndex],
        };
      }, {}),
    );

    // Clear column width when changing page
    const unlisten = history.listen((_location) => {
      sessionStorage.removeItem(COLUMNS_WIDTH);
    });
    return () => {
      unlisten();
    };
  }, [columns, visibleCols, visibleColumnsKey, history]);

  // Effect to update cols everytime columns change
  useEffect(() => {
    initView(
      datasourceId,
      columns.reduce(
        (colState, col) => ({ ...colState, [getVisibilityIndexor(col)]: true }),
        {},
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * EVENT HANDLERS
   */
  const onResizeColumn = (newWidth, columnIdx) => {
    const newWidths = visibleColumnsKey.reduce((results, key, keyIndex) => {
      return {
        ...results,
        [key]: keyIndex === columnIdx ? newWidth : columnWidths[key],
      };
    }, {});
    sessionStorage.setItem(COLUMNS_WIDTH, JSON.stringify(newWidths));
    setColumnWidths(newWidths);
  };

  const onMoveRow = (sourceIdx, destinationIdx) => {
    if (onMove && typeof onMove === 'function') {
      onMove(sourceIdx, destinationIdx);
    }
  };

  const onRowHandler = draggable
    ? (record, index) => ({ index, moveRow: onMoveRow })
    : onRow || null;

  /**
   * MEMOIZED PROPS
   */

  // Memoized calculated width
  const fixedWidthCols = useMemo(
    () => getFixedWidthCols(columns, visibleCols),
    [columns, visibleCols],
  );

  const _width = useMemo(
    () => getTotalAvailableWidth(fixedWidthCols, !!expandedRowRender, width),
    [fixedWidthCols, width, expandedRowRender],
  );

  // Memoized variable with the visible column definitions
  const _cols = useMemo(
    () =>
      getColumnObjectArrayForTable(
        columns,
        visibleCols,
        visibleColumnsKey.map((key) => columnWidths[key]),
        _width,
        fixedWidthCols.length,
        resizable,
        !!expandedRowRender,
        onResizeColumn,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      columns,
      visibleCols,
      visibleColumnsKey,
      _width,
      fixedWidthCols.length,
      resizable,
      expandedRowRender,
      columnWidths,
    ],
  );

  // Memoized datasource filtered on filter query
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _dataSource = useMemo(
    () => filterDataSource(filterQuery, dataSource, _cols, onSearch),
    [filterQuery, dataSource, _cols, onSearch],
  );
  const _shouldShowFilterBar = useMemo(
    () => shouldShowFilterBar(showFilter, onSearch, _cols),
    [showFilter, onSearch, _cols],
  );
  const _tableComponents = useMemo(() => getTableComponents(draggable), [
    draggable,
  ]);

  const otherProps = useMemo(() => (rowSelection ? { rowSelection } : {}), [
    rowSelection,
  ]);

  return (
    <div className={`${className || ''} dynamic-table--wrapper`}>
      {showColumnSelection ? (
        <ColumnSelector
          columns={columns.map((col) => [
            getVisibilityIndexor(col),
            isColumnVisible(col, visibleCols),
            col.title,
          ])}
          onColumnStateChange={({ colIndex, newVisibility }) =>
            updateView(datasourceId, {
              ...visibleCols,
              [colIndex]: newVisibility,
            })
          }
          onHide={() => setShowColumnSelection(false)}
        />
      ) : (
        <React.Fragment>
          {_shouldShowFilterBar && (
            <FilterBar
              query={filterQuery}
              onChange={(newFilterQuery) => setFilterQuery(newFilterQuery)}
            />
          )}
          <DndProvider backend={HTML5Backend}>
            <Table
              components={_tableComponents}
              columns={[
                ..._cols,
                columnModifierColumn(() => setShowColumnSelection(true)),
              ]}
              dataSource={_dataSource}
              rowKey={rowKey}
              expandedRowRender={expandedRowRender || null}
              pagination={pagination}
              loading={isLoading}
              sortDirections={['descend', 'ascend']}
              onRow={onRowHandler}
              {...otherProps}
            />
          </DndProvider>
        </React.Fragment>
      )}
    </div>
  );
};

DynamicTableHOC.propTypes = {
  className: PropTypes.string,
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
  draggable: PropTypes.bool,
  onSearch: PropTypes.func,
  onMove: PropTypes.func,
  rowSelection: PropTypes.object,
};

DynamicTableHOC.defaultProps = {
  className: null,
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
  draggable: false,
  onSearch: null,
  onMove: null,
};

export default withResizeDetector(
  connect(mapStateToProps, mapActionsToProps)(DynamicTableHOC),
);
