import { Key } from 'react';
import { TActivity } from 'Types/Activity.type';
import SortableTableCell from '../../DynamicTable/SortableTableCell';
import SchedulingActions from './SchedulingActions/SchedulingActions';

export const SchedulingColumns = (selectedRowKeys: Key[] = [], actions) => [
  {
    title: '',
    key: 'activityScheduling',
    dataIndex: undefined,
    width: 130,
    resizable: false,
    render: (activity: TActivity) => (
      <SortableTableCell className={`activityScheduling_${activity._id}`}>
        <SchedulingActions
          activity={activity}
          selectedRowKeys={selectedRowKeys}
          actions={actions}
        />
      </SortableTableCell>
    ),
  },
];
