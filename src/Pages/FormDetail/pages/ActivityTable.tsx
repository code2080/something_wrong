import { Key, useMemo, useState } from 'react';
import { TActivity } from 'Types/Activity.type';
import _ from 'lodash';

import { TableProps } from 'antd';
import type { ColumnsType, SorterResult } from 'antd/lib/table/interface';
import { ConflictType } from 'Models/JointTeachingGroup.model';
import { createActivitiesTableColumnsFromMapping } from '../../../Components/ActivitiesTableColumns/ActivitiesTableColumns';
import DynamicTable from '../../../Components/DynamicTable/DynamicTableHOC';

import { useActivitiesObjectWatcher } from 'Hooks/useActivities';

interface Props extends TableProps<any> {
  design: any;
  activities: TActivity[];
  selectedActivities?: Key[];
  isLoading?: boolean;
  paginationParams?: { limit: number; currentPage: number; totalPages: number };
  onSelect?(selectedRowKeys: Key[]): void;
  onSort?(sorter: SorterResult<object> | SorterResult<object>[]): void;
  additionalColumns?: { pre?: ColumnsType<object>; post?: ColumnsType<object> };
  columnPrefix?: (
    type: ConflictType,
    [activity, activityIndex],
    [activityValue, valueIndex],
  ) => void;
  renderer?: (type: ConflictType, activity: TActivity, extId: string) => void;
  onSetCurrentPaginationParams?: (page: number, limit: number) => void;
}

const ActivityTable = ({
  design,
  activities,
  isLoading = false,
  paginationParams,
  selectedActivities,
  onSelect = _.noop,
  onSort = _.noop,
  additionalColumns = {
    pre: [],
    post: [],
  },
  columnPrefix,
  renderer,
  onSetCurrentPaginationParams,
  ...props
}: Props) => {
  useActivitiesObjectWatcher({ activities });
  const calculateAvailableTableHeight = () => {
    return ((window as any).tePrefsHeight ?? 500) - 110;
  };
  const totalPages =
    (paginationParams?.limit as number) *
    (paginationParams?.totalPages as number);

  const [yScroll] = useState(calculateAvailableTableHeight());
  const tableColumns = useMemo(
    () =>
      design
        ? createActivitiesTableColumnsFromMapping(
            design,
            columnPrefix,
            renderer,
          )
        : [],
    [design, columnPrefix, renderer],
  );
  return (
    <DynamicTable
      scroll={{ y: yScroll }}
      columns={[
        ...(additionalColumns.pre ?? []),
        ...tableColumns,
        ...(additionalColumns.post ?? []),
      ]}
      dataSource={activities}
      rowClassName='test-row'
      rowKey='_id'
      loading={isLoading}
      rowSelection={
        selectedActivities && {
          selectedRowKeys: selectedActivities,
          onChange: (selectedRowKeys) => onSelect(selectedRowKeys as Key[]),
        }
      }
      pagination={{
        total: totalPages || 10,
        onChange: (page, limit) => {
          if (onSetCurrentPaginationParams)
            onSetCurrentPaginationParams(page, limit);
        },
      }}
      onChange={(pagination, filter, sorter) => {
        onSort(sorter);
      }}
      resizable
      {...props}
    />
  );
};
export default ActivityTable;
