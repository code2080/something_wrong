import { Key, useMemo, useState } from 'react';
import { TActivity } from 'Types/Activity.type';
import _ from 'lodash';

import { TableProps } from 'antd';
import type { ColumnsType, SorterResult } from 'antd/lib/table/interface';
import { ConflictType } from 'Models/JointTeachingGroup.model';
import { createActivitiesTableColumnsFromMapping } from '../../../Components/ActivitiesTableColumns/ActivitiesTableColumns';
import VirtualTable from '../../../Components/VirtualTable/VirtualTable';
import { useActivitiesObjectWatcher } from 'Hooks/useActivities';

interface Props extends TableProps<any> {
  design: any;
  activities: TActivity[];
  selectedActivities?: Key[];
  isLoading?: boolean;
  onSelect?(selectedRowKeys: Key[]): void;
  onSort?(sorter: SorterResult<object> | SorterResult<object>[]): void;
  additionalColumns?: { pre?: ColumnsType<object>; post?: ColumnsType<object> };
  columnPrefix?: (
    type: ConflictType,
    [activity, activityIndex],
    [activityValue, valueIndex],
  ) => void;
  renderer?: (type: ConflictType, activity: TActivity, extId: string) => void;
  onLoadMore?: () => void;
}

const ActivityTable = ({
  design,
  activities,
  isLoading = false,
  selectedActivities,
  onSelect = _.noop,
  onSort = _.noop,
  additionalColumns = {
    pre: [],
    post: [],
  },
  columnPrefix,
  renderer,
  onLoadMore,
  ...props
}: Props) => {
  useActivitiesObjectWatcher({ activities });

  const calculateAvailableTableHeight = () => {
    return ((window as any).tePrefsHeight ?? 500) - 110;
  };

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
    <VirtualTable
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
      onChange={(pagination, filters, sorter) => onSort(sorter)}
      {...props}
      onLoadMore={onLoadMore}
    />
  );
};
export default ActivityTable;
