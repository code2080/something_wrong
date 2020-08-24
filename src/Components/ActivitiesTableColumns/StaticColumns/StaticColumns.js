import React from 'react';
import ActivityActionsDropdown from '../ActivityActionsDropdown';
import ActivityStatusCol from './ActivityStatusCol';

export const StaticColumns = [
  {
    title: 'Status',
    key: 'activityStatus',
    dataIndex: null,
    fixedWidth: 150,
    render: (_, activity) => <ActivityStatusCol activity={activity} />,
  },
  {
    title: 'Id',
    key: 'reservationId',
    dataIndex: 'reservationId',
    fixedWidth: 75,
    render: reservationId => reservationId || 'N/A',
  },
  {
    title: '',
    key: 'actions',
    dataIndex: null,
    fixedWidth: 40,
    render: (_, activity) => <ActivityActionsDropdown buttonType="more" activity={activity} />,
  },
];
