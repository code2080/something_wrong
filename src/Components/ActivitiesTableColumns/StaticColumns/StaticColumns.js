import React from 'react';
import { sortByElementHtml } from '../../../Utils/sorting.helpers';
import SortableTableCell from '../../DynamicTable/SortableTableCell';
import ActivityActionsDropdown from '../ActivityActionsDropdown';
import ActivityStatusCol from './ActivityStatusCol';

export const StaticColumns = [
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
  {
    title: 'Id',
    key: 'reservationId',
    dataIndex: 'reservationId',
    fixedWidth: 75,
    render: (reservationId, item = {}) => (
      <SortableTableCell className={`reservationId_${item._id}`}>
        {reservationId || 'N/A'}
      </SortableTableCell>
    ),
    sorter: (a, b) => {
      return sortByElementHtml(`.reservationId_${a._id}`, `.reservationId_${b._id}`);
    },
  },
  {
    title: '',
    key: 'actions',
    dataIndex: null,
    fixedWidth: 40,
    render: activity => <ActivityActionsDropdown buttonType="more" activity={activity} />,
  },
];
