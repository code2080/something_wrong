import React from 'react';
import { TActivity } from 'Types/Activity.type';
import SortableTableCell from '../../DynamicTable/SortableTableCell';

export const JointTeachingColumn = () => [
  {
    title: 'Joint teaching object',
    key: 'activityScheduling',
    dataIndex: undefined,
    width: 240,
    render: (activity: TActivity) => (
      <SortableTableCell
        className={`activityJointTeachingTable_${activity?.jointTeaching?.object}`}
      >
        <span>{activity?.jointTeaching?.object}</span>
      </SortableTableCell>
    ),
    sorter: true,
  },
];
