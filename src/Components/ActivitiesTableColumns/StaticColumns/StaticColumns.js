import React from 'react';
import { activityStatusProps } from '../../../Constants/activityStatuses.constants';
import StatusTag from '../../StatusTag';
import ActivityActionsDropdown from '../ActivityActionsDropdown';

export const StaticColumns = [
  {
    title: 'Status',
    key: 'activityStatus',
    dataIndex: 'activityStatus',
    render: activityStatus => (
      <StatusTag color={activityStatusProps[activityStatus].color}>
        {activityStatusProps[activityStatus].label}
      </StatusTag>
    )
  },
  {
    title: 'Reservation Id',
    key: 'reservationId',
    dataIndex: 'reservationId',
    render: reservationId => reservationId || 'N/A',
  },
  {
    title: 'Actions',
    key: 'actions',
    dataIndex: null,
    render: (_, activity) => <ActivityActionsDropdown buttonType="more" activity={activity} />,
  },
];
