import { useState, useEffect, useRef, useMemo, Key } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ResizeObserver from 'rc-resize-observer';
import classNames from 'classnames';
import { Table } from 'antd';

import './VirtualTable.scss';
import { ColumnType } from 'antd/lib/table';
import { TActivity } from '../../Types/Activity.type';
import SelectionColumn from './SelectionColumn';

const VirtualTable = (props: Parameters<typeof Table>[0]) => {
  const { columns, scroll, rowSelection, rowKey, dataSource, className } =
    props;
  const [tableWidth, setTableWidth] = useState(0);
  const ref = useRef(null);
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
  useEffect(() => {
    if (!ref.current) return;
    const current: ResizeObserver = ref.current;
    const parentWidth =
      (current?.currentElement as HTMLElement)?.offsetWidth ?? 0;
    setTableWidth(parentWidth);
  }, [!ref]);

  const renderVirtualList = (
    rawData: readonly object[],
    { scrollbarSize, ref, onScroll }: any,
  ) => {
    ref.current = connectObject;
    const totalHeight = rawData.length * 30;

    const Cell = ({ rowIndex, columnIndex }) => {
      const rowData = rawData[rowIndex] as any;
      if (!rowData) return null;
      const currentColumn = mergedColumns[columnIndex] as any;
      const dataIndex = currentColumn.dataIndex;
      if (typeof currentColumn.render === 'function')
        return dataIndex
          ? currentColumn.render(rowData[dataIndex], rowData, rowIndex)
          : currentColumn.render(rowData, rowIndex);
      return rowData[dataIndex] ?? 'N/A';
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
              className={classNames(
                'virtual-table-cell',
                'ant-table-cell',
                {
                  'virtual-table-cell-last':
                    columnIndex === mergedColumns.length - 1,
                  'virtual-table-row-last':
                    rowIndex === (dataSource || []).length - 1,
                  'inactivate-table-cell': activity.isInactive(),
                },
                mergedColumns[columnIndex]?.className || '',
              )}
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
      ref={ref}
    >
      <Table
        {...props}
        style={{
          maxWidth: (document.getElementById('te-prefs-lib') || document.body)
            .offsetWidth,
        }}
        className={`${className || ''} virtual-table`}
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
