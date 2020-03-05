import React from 'react';
import { activityStatusProps } from '../../Constants/activityStatuses.constants';
import { mappingTimingModes, mappingTimingModeProps } from '../../Constants/mappingTimingModes.constants';
import StatusTag from '../StatusTag';
import ActivityActionsDropdown from './ActivityActionsDropdown';
import BaseActivityCol from './BaseActivityCol';
import moment from 'moment';

const timingCols = ({
  mode: mapping => ({
    title: 'Timing mode',
    key: 'mode',
    dataIndex: null,
    render: (_, activity) => (
      <BaseActivityCol
        activity={activity}
        type="TIMING"
        prop="mode"
        propTitle="Timing mode"
        formatFn={value => mappingTimingModeProps[value].label}
        mapping={mapping}
      />
    ),
  }),
  startTimeExact: mapping => ({
    title: 'Start time',
    key: 'startTime',
    dataIndex: null,
    render: (_, activity) => (
      <BaseActivityCol
        activity={activity}
        type="TIMING"
        prop="startTime"
        propTitle="Start time"
        formatFn={value => moment.utc(value).format('YYYY-MM-DD HH:mm')}
        mapping={mapping}
      />
    ),
  }),
  endTimeExact: mapping => ({
    title: 'End time',
    key: 'endTime',
    dataIndex: null,
    render: (_, activity) => (
      <BaseActivityCol
        activity={activity}
        type="TIMING"
        prop="endTime"
        propTitle="End time"
        formatFn={value => moment.utc(value).format('YYYY-MM-DD HH:mm')}
        mapping={mapping}
      />
    ),
  }),
  startTimeTimeslots: mapping => ({
    title: 'Start after or at:',
    key: 'startTime',
    dataIndex: null,
    render: (_, activity) => (
      <BaseActivityCol
        activity={activity}
        type="TIMING"
        prop="startTime"
        propTitle="Start after or at"
        formatFn={value => moment.utc(value).format('YYYY-MM-DD HH:mm')}
        mapping={mapping}
      />
    ),
  }),
  endTimeTimeslots: mapping => ({
    title: 'End before or at:',
    key: 'endTime',
    dataIndex: null,
    render: (_, activity) => (
      <BaseActivityCol
        activity={activity}
        type="TIMING"
        prop="endTime"
        propTitle="End before or at"
        formatFn={value => moment.utc(value).format('YYYY-MM-DD HH:mm')}
        mapping={mapping}
      />
    ),
  }),
  length: mapping => ({
    title: 'Length',
    key: 'length',
    dataIndex: null,
    render: (_, activity) => (
      <BaseActivityCol
        activity={activity}
        type="TIMING"
        prop="length"
        propTitle="Length"
        mapping={mapping}
      />
    ),
  }),
});

export const ASTableTimingCols = ({
  [mappingTimingModes.EXACT]: mapping => [
    // timingCols.mode(mapping),
    timingCols.startTimeExact(mapping),
    timingCols.endTimeExact(mapping)
  ],
  [mappingTimingModes.TIMESLOTS]: mapping => [
    // timingCols.mode(mapping),
    timingCols.startTimeTimeslots(mapping),
    timingCols.endTimeTimeslots(mapping),
    timingCols.length(mapping)
  ],
});

export const ASTableStaticCols = [
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
