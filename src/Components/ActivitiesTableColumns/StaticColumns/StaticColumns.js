import React from 'react';
import { activityStatusProps } from '../../../Constants/activityStatuses.constants';
import StatusTag from '../../StatusTag';
import ActivityActionsDropdown from '../ActivityActionsDropdown';

export const StaticColumns = [
  {
    title: 'Status',
    key: 'activityStatus',
    dataIndex: 'activityStatus',
    fixedWidth: 150,
    render: activityStatus => (
      <StatusTag color={activityStatusProps[activityStatus].color}>
        {activityStatusProps[activityStatus].label}
      </StatusTag>
    )
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
