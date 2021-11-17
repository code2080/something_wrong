import { Key } from 'react';
import { TActivity } from 'Types/Activity.type';
import SortableTableCell from '../../DynamicTable/SortableTableCell';
import SchedulingActions from './SchedulingActions/SchedulingActions';

export const SchedulingColumns = (selectedRowKeys: Key[] = []) => [
  {
    title: '',
    key: 'activityScheduling',
    dataIndex: undefined,
    width: 110,
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
