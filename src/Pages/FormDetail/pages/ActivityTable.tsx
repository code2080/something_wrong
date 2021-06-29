import { Key, useMemo, useState } from 'react';
import VirtualTable from '../../../Components/VirtualTable/VirtualTable';
import { createActivitiesTableColumnsFromMapping } from '../../../Components/ActivitiesTableColumns/ActivitiesTableColumns';
import { TActivity } from 'Types/Activity.type';
import _ from 'lodash';

import type { SorterResult } from 'antd/lib/table/interface';

type Props = {
  design: any;
  activities: TActivity[];
  selectedActivities?: Key[];
  isLoading?: boolean;
  onSelect?(selectedRowKeys: Key[]): void;
  onSort?(sorter: SorterResult<object> | SorterResult<object>[]): void;
};

const ActivityTable = ({
  design,
  activities,
  isLoading = false,
  selectedActivities = [],
  onSelect = _.noop,
  onSort = _.noop,
  ...props
}: Props) => {
  const calculateAvailableTableHeight = () => {
    return ((window as any).tePrefsHeight ?? 500) - 110;
  };

  const [yScroll] = useState(calculateAvailableTableHeight());
  const tableColumns = useMemo(
    () => (design ? createActivitiesTableColumnsFromMapping(design) : []),
    [design],
  );
  return (
    <VirtualTable
      scroll={{ y: yScroll }}
      columns={tableColumns}
      dataSource={activities}
      rowKey='_id'
      loading={isLoading && !activities?.length}
      rowSelection={{
        selectedRowKeys: selectedActivities,
        onChange: (selectedRowKeys) => onSelect(selectedRowKeys as Key[]),
      }}
      onChange={(pagination, filters, sorter) => onSort(sorter)}
      {...props}
    />
  );
};
export default ActivityTable;
