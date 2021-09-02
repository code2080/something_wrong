import { Key } from 'react';
import { TActivity } from 'Types/Activity.type';
import SortableTableCell from '../../DynamicTable/SortableTableCell';
import SchedulingActions from './SchedulingActions/SchedulingActions';

export const SchedulingColumns = (
  selectedRowKeys: Key[] = [],
  isBeta = false,
) => [
  {
    title: '',
    key: 'activityScheduling',
    dataIndex: undefined,
    width: isBeta ? 110 : 90,
    render: (activity: TActivity) => (
      <SortableTableCell className={`activityScheduling_${activity._id}`}>
        <SchedulingActions
          activity={activity}
          selectedRowKeys={selectedRowKeys}
        />
      </SortableTableCell>
    ),
  },
];
