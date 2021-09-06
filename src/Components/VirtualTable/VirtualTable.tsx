import { useState, useEffect, useRef, useMemo, Key } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ResizeObserver from 'rc-resize-observer';
import classNames from 'classnames';
import { Table } from 'antd';
import SelectionColumn from './SelectionColumn';

import './VirtualTable.scss';
import { ColumnType } from 'antd/lib/table';
import { TActivity } from '../../Types/Activity.type';

const VirtualTable = (props: Parameters<typeof Table>[0]) => {
  const { columns, scroll, rowSelection, rowKey, dataSource } = props;
  const [tableWidth, setTableWidth] = useState(0);

  const columnswithSelection = [
    SelectionColumn({
      rowSelection,
      dataSource,
      mapDataSource: _.groupBy(dataSource, '_id') as { [key: string]: object },
      rowKey: rowKey as Key | undefined,
    }),
    ...(columns ?? []),
  ].filter(Boolean) as ColumnType<object>[];

  const widthColumnCount = columnswithSelection!.filter(
    ({ width }) => !width,
  ).length;

  const mergedColumns = columnswithSelection!.map((column) => {
    if (column.width) {
      return column;
    }

    return {
      ...column,
      width: Math.floor(tableWidth / widthColumnCount),
    };
  });

  const gridRef = useRef<any>();
  const connectObject = useMemo(
    () => ({
      scrollLeft: {
        get: () => null,
        set: (scrollLeft: number) => gridRef?.current.scrollTo({ scrollLeft }),
      },
    }),
    [],
  );

  const resetVirtualGrid = () => {
    gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    });
  };

  useEffect(() => resetVirtualGrid, [tableWidth]);

  const renderVirtualList = (
    rawData: readonly object[],
    { scrollbarSize, ref, onScroll }: any,
  ) => {
    ref.current = connectObject;
    const totalHeight = rawData.length * 30;

    const Cell = ({ rowIndex, columnIndex }) => {
      const rowData = rawData[rowIndex] as any;
      const currentColumn = mergedColumns[columnIndex] as any;
      const dataIndex = currentColumn.dataIndex;
      const result =
        typeof currentColumn.render === 'function'
          ? currentColumn.render(dataIndex ? rowData[dataIndex] : rowData)
          : rowData[dataIndex] ?? 'N/A';
      return result;
    };

    return (
      <Grid
        ref={gridRef}
        className='virtual-grid ant-table-body'
        columnCount={mergedColumns.length}
        columnWidth={(index: number) => {
          const { width } = mergedColumns[index];
          return totalHeight > scroll!.y! && index === mergedColumns.length - 1
            ? (width as number) - scrollbarSize - 1
            : (width as number);
        }}
        height={scroll!.y as number}
        rowCount={rawData.length}
        rowHeight={() => 30}
        width={tableWidth}
        onScroll={onScroll}
      >
        {({ columnIndex, rowIndex, style }) => {
          const activity = rawData[rowIndex] as TActivity;

          return (
            <div
              className={classNames('virtual-table-cell', 'ant-table-cell', {
                'virtual-table-cell-last':
                  columnIndex === mergedColumns.length - 1,
                'inactivate-table-cell': activity.isInactive(),
              })}
              style={style}
            >
              {Cell({ rowIndex, columnIndex })}
            </div>
          );
        }}
      </Grid>
    );
  };

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <Table
        {...props}
        className='virtual-table'
        columns={mergedColumns}
        pagination={false}
        components={{
          body: renderVirtualList,
        }}
      />
    </ResizeObserver>
  );
};
VirtualTable.propTypes = {
  items: PropTypes.array,
};
VirtualTable.defaultProps = {
  items: [],
};

export default VirtualTable;
