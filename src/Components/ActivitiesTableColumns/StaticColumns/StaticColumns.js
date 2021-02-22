import React from 'react';
import { sortByElementHtml } from '../../../Utils/sorting.helpers';
import SortableTableCell from '../../DynamicTable/SortableTableCell';
import SubmissionColumn from './SubmissionColumn';

export const StaticColumns = includeSubmissionInfo => [
  ...(includeSubmissionInfo
    ? [
      {
        title: 'Submission',
        key: 'formInstanceId',
        dataIndex: 'formInstanceId',
        render: formInstanceId => (
          <SortableTableCell className={`formInstanceId_${formInstanceId}`}>
            <SubmissionColumn formInstanceId={formInstanceId} />
          </SortableTableCell>
        ),
        sorter: (a, b) => {
          return sortByElementHtml(`.formInstanceId_${a.formInstanceId}`, `.formInstanceId_${b.formInstanceId}`);
        },
      }
    ]
    : []),
];
