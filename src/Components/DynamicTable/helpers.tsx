// COMPONENTS
import EllipsisTruncater from '../TableColumns/Components/EllipsisTruncater';
import ResizableHeaderCell from './ResizableHeaderCell';
import { DraggableBodyRow } from './dnd/BodyRow';

/**
 * @function getVisibilityIndexor
 * @description Assuming that the key is most likely to be persistent, if not defined, fallback on title
 * @param {Object} column
 * @returns String
 */
export const getVisibilityIndexor = (column) => column.key || column.title;

/**
 * @function isColumnVisible
 * @description determines whether a column should be visible or not
 * @param {Object} column
 * @param {Array} visibleColumns
 * @returns Bool
 */
export const isColumnVisible = (column, visibleColumns) => {
  const visibleByIndexor = visibleColumns[getVisibilityIndexor(column)];
  const visibleByTitle = visibleColumns[column.title];

  if (visibleByIndexor !== undefined) return visibleByIndexor;
  return visibleByTitle === undefined ? true : visibleByTitle;
};

/**
 * @function getFixedWidthCols
 * @description Get all visible columns that should have a fixed width
 * @param {Array} columns
 * @param {Array} visiblecolumns
 * @returns Array
 */
export const getFixedWidthCols = (columns, visiblecolumns) =>
  columns.filter(
    (col) => isColumnVisible(col, visiblecolumns) && col.fixedWidth,
  );

/**
 * @function getTotalAvailableWidth
 * @description get the total available width less fixed width columns + expanded row renderer
 * @param {Array} fixedWidthCols
 * @param {Bool} hasExpandedRowRenderer
 * @param {Number} defaultTotalWidth
 * @returns Number
 */
export const getTotalAvailableWidth = (
  fixedWidthCols,
  hasExpandedRowRenderer,
  defaultTotalWidth,
) => {
  // Get the visible columns
  const fixedWidth = fixedWidthCols.reduce(
    (tot, col) => (col.fixedWidth ? tot + col.fixedWidth : tot),
    0,
  );
  const constant = hasExpandedRowRenderer ? 90 : 40;
  return defaultTotalWidth ? defaultTotalWidth - (fixedWidth + constant) : 0;
};

/**
 * @function calculateColumnWidth
 * @param {Number} columnIdx
 * @param {Array} columnWidths
 * @param {Number} totalAvailableWidth
 * @param {Number} totalNumberOfColumns
 * @param {Number} numberOfFixedWidthColumns
 * @returns Number
 */
const calculateColumnWidth = ({
  title = '',
  columnIdx,
  columnWidths,
  totalAvailableWidth,
  totalNumberOfColumns,
  numberOfFixedWidthColumns,
}) => {
  return Math.max(
    50 + title.length * 5.5,
    columnWidths[columnIdx]
      ? columnWidths[columnIdx]
      : totalAvailableWidth /
          (totalNumberOfColumns - numberOfFixedWidthColumns),
  );
};

/**
 * @function getColumnObjectArrayForTable
 * @param {Array} columns
 * @param {Array} visibleColumns,
 * @param {Array} columnWidths
 * @param {Number} totalAvailableWidth
 * @param {Number} numberOfFixedWidthColumns
 * @param {Bool} allowResizing
 * @param {Bool} hasExpandedRowRenderer
 * @param {Func} onSetColumnWidths
 */
export const getColumnObjectArrayForTable = (
  columns,
  visibleColumns,
  columnWidths,
  totalAvailableWidth,
  numberOfFixedWidthColumns,
  allowResizing,
  hasExpandedRowRenderer,
  onResizeColumn,
  nowrap,
) =>
  columns
    // Filter out non-visible columns
    .filter((col) => isColumnVisible(col, visibleColumns))
    // Map each column definition with the right handlers
    .map((col, idx, arr) => ({
      ...col,
      width: allowResizing
        ? calculateColumnWidth({
            title: col.title,
            columnIdx: idx,
            columnWidths,
            totalAvailableWidth,
            totalNumberOfColumns: arr.length,
            numberOfFixedWidthColumns,
          })
        : col.width,
      onHeaderCell: () => ({
        resizable: allowResizing && col.resizable !== false,
        width: allowResizing
          ? calculateColumnWidth({
              title: col.title,
              columnIdx: idx,
              columnWidths,
              totalAvailableWidth,
              totalNumberOfColumns: arr.length,
              numberOfFixedWidthColumns,
            })
          : col.width,
        title: col.title,
        index: idx,
        expandable: hasExpandedRowRenderer,
        onResized: (newWidth) => onResizeColumn(newWidth, idx),
      }),
      render: nowrap
        ? col.render
        : (val, el) =>
            col.render ? (
              <EllipsisTruncater
                width={calculateColumnWidth({
                  title: col.title,
                  columnIdx: idx,
                  columnWidths,
                  totalAvailableWidth,
                  totalNumberOfColumns: arr.length,
                  numberOfFixedWidthColumns,
                })}
              >
                {col.render(val, el)}
              </EllipsisTruncater>
            ) : (
              <EllipsisTruncater
                width={calculateColumnWidth({
                  title: col.title,
                  columnIdx: idx,
                  columnWidths,
                  totalAvailableWidth,
                  totalNumberOfColumns: arr.length,
                  numberOfFixedWidthColumns,
                })}
              >
                {val}
              </EllipsisTruncater>
            ),
    }));

/**
 * @function shouldShowFilterBar
 * @description determines whether we should display a filter bar
 * @param {Bool} showFilter
 * @param {Func} onSearch
 * @param {Array} columns
 * @returns Bool
 */
export const shouldShowFilterBar = (showFilter, onSearch, columns) =>
  showFilter &&
  (typeof onSearch === 'function' ||
    columns.some(({ dataIndex, filterFn }) => dataIndex || filterFn));

/**
 * @function filterDataSource
 * @description returns a filtered data source based on the filter query and the column data
 * @param {String} filterQuery
 * @param {Array} dataSource
 * @param {Array} columns
 * @param {Func} onSearch
 * @returns Array
 */
export const filterDataSource = (
  filterQuery,
  dataSource,
  columns,
  onSearch,
) => {
  if (filterQuery === '') return dataSource;
  // Filter data source by iterating over each of the visible columns and determine if one of them contains the query
  return dataSource.filter((el) => {
    if (typeof onSearch === 'function') return onSearch(el, filterQuery);
    return columns.some((col) => {
      const { dataIndex, filterFn } = col;
      const filterVal =
        (filterFn && filterFn(el, filterQuery)) || el[dataIndex];
      if (!filterVal) return false;
      return filterVal
        .toString()
        .toLowerCase()
        .includes(filterQuery.toString().toLowerCase());
    });
  });
};

/**
 * @function getTableComponents
 * @description function to get the non-standard table components used
 * @param {Bool} isTableDraggable
 * @returns Object
 */
export const getTableComponents = (isTableDraggable) => ({
  header: {
    cell: ResizableHeaderCell,
  },
  ...(isTableDraggable ? { body: { row: DraggableBodyRow } } : {}),
});
