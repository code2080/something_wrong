import { Key } from 'react';
import { TActivity } from 'Types/Activity.type';
import _ from 'lodash';

import { TableProps } from 'antd';
import type { ColumnsType, SorterResult } from 'antd/lib/table/interface';
import { ConflictType } from 'Models/JointTeachingGroup.model';
import {
  CreateActivitiesAllocatedTableColumns,
  CreateActivitiesTableColumnsFromMapping,
} from '../../../../Components/ActivitiesTableColumns/ActivitiesTableColumns';
import DynamicTable from '../../../../Components/DynamicTable/DynamicTableHOC';

import { useActivitiesObjectWatcher } from 'Hooks/useActivities';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedActivities } from 'Redux/GlobalUI/globalUI.selectors';
import { selectActivitiesInTable } from 'Redux/GlobalUI/globalUI.actions';

interface Props extends TableProps<any> {
  tableType?: string;
  selectable?: boolean;
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
  resizable?: boolean;
  onSetCurrentPaginationParams?: (page: number, limit: number) => void;
}

const ActivityTable = ({
  design,
  activities,
  isLoading = false,
  paginationParams,
  onSort = _.noop,
  additionalColumns = {
    pre: [],
    post: [],
  },
  columnPrefix,
  renderer,
  onSetCurrentPaginationParams,
  tableType,
  selectable = true,
  resizable = true,
  ...props
}: Props) => {
  const dispatch = useDispatch();
  const selectedActivitiesIds = useSelector(
    selectSelectedActivities(tableType),
  );
  useActivitiesObjectWatcher({ activities });
  const totalPages =
    (paginationParams?.limit as number) *
    (paginationParams?.totalPages as number);

  const tableColumns = design
    ? CreateActivitiesTableColumnsFromMapping({
        design,
        columnPrefix,
        renderer,
      })
    : [];

  const allocatedColumns = CreateActivitiesAllocatedTableColumns({
    activities,
    design,
  });
  const onRowSelect = (selectedRowKeys: string[]) => {
    dispatch(selectActivitiesInTable(tableType, selectedRowKeys));
  };

  return (
    <DynamicTable
      columns={[
        ...(additionalColumns.pre ?? []),
        ...tableColumns,
        ...allocatedColumns,
        ...(additionalColumns.post ?? []),
      ]}
      dataSource={activities}
      rowClassName='test-row'
      rowKey='_id'
      loading={isLoading}
      rowSelection={
        selectable && {
          selectedRowKeys: selectedActivitiesIds,
          onChange: onRowSelect,
          preserveSelectedRowKeys: true,
        }
      }
      pagination={{
        size: 'small',
        current: paginationParams?.currentPage || 1,
        pageSize: paginationParams?.limit || 10,
        total: totalPages || 10,
        onChange: (page, limit) => {
          if (onSetCurrentPaginationParams)
            onSetCurrentPaginationParams(page, limit);
        },
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 30, 40, 50, 100],
      }}
      onChange={(pagination, filter, sorter) => {
        onSort(sorter);
      }}
      resizable={resizable}
      {...props}
    />
  );
};
export default ActivityTable;
