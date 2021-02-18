import React from 'react';
import { sortByElementHtml } from '../../../Utils/sorting.helpers';
import ActivityStatusCol from './StatusCol/ActivityStatusCol';
import SortableTableCell from '../../DynamicTable/SortableTableCell';
import SchedulingActions from './SchedulingActions/SchedulingActions';

export const SchedulingColumns = [
  {
    title: '',
    key: 'activityScheduling',
    dataIndex: undefined,
    fixedWidth: 90,
    render: activity => (
      <SortableTableCell className={`activityScheduling_${activity._id}`}>
        <SchedulingActions activity={activity} />
      </SortableTableCell>
    ),
  },
  {
    title: 'Status',
    key: 'activityStatus',
    dataIndex: null,
    fixedWidth: 150,
    render: activity => (
      <SortableTableCell className={`activityStatus_${activity._id}`}>
        <ActivityStatusCol activity={activity} />
      </SortableTableCell>
    ),
    sorter: (a, b) => {
      return sortByElementHtml(`.activityStatus_${a._id}`, `.activityStatus_${b._id}`);
    },
  },
];
