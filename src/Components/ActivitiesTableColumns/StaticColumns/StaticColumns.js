import React from 'react';
import { sortByElementHtml } from '../../../Utils/sorting.helpers';
import SortableTableCell from '../../DynamicTable/SortableTableCell';

export const StaticColumns = includeSubmissionInfo => [
  ...(includeSubmissionInfo
    ? [
      {
        title: 'Submission id',
        key: 'formInstanceId',
        dataIndex: null,
        fixedWidth: 100,
        render: activity => (
          <SortableTableCell className={`formInstanceId_${activity._id}`}>
            {activity.formInstanceId}
          </SortableTableCell>
        ),
        sorter: (a, b) => {
          return sortByElementHtml(`.formInstanceId_${a._id}`, `.formInstanceId_${b._id}`);
        },
      }
    ]
    : []),
];
