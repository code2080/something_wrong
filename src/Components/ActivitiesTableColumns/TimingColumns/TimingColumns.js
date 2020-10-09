import React from 'react';
import moment from 'moment';

// CONSTANTS
import {
  mappingTimingModes,
  mappingTimingModeProps
} from '../../../Constants/mappingTimingModes.constants';
import BaseActivityCol from '../BaseColumn/BaseActivityCol';

const timingCols = {
  mode: mapping => ({
    title: 'Timing mode',
    key: 'mode',
    dataIndex: null,
    render: activity => (
      <BaseActivityCol
        activity={activity}
        type="TIMING"
        prop="mode"
        propTitle="Timing mode"
        formatFn={value => mappingTimingModeProps[value].label}
        mapping={mapping}
      />
    )
  }),
  startTimeExact: mapping => ({
    title: 'Start time',
    key: 'startTime',
    dataIndex: null,
    render: activity => (
      <BaseActivityCol
        activity={activity}
        type="TIMING"
        prop="startTime"
        propTitle="Start time"
        formatFn={value => moment(value).format('YYYY-MM-DD HH:mm')}
        mapping={mapping}
      />
    )
  }),
  endTimeExact: mapping => ({
    title: 'End time',
    key: 'endTime',
    dataIndex: null,
    render: activity => (
      <BaseActivityCol
        activity={activity}
        type="TIMING"
        prop="endTime"
        propTitle="End time"
        formatFn={value => moment(value).format('YYYY-MM-DD HH:mm')}
        mapping={mapping}
      />
    )
  }),
  startTimeTimeslots: mapping => ({
    title: 'Start after or at:',
    key: 'startTime',
    dataIndex: null,
    render: activity => (
      <BaseActivityCol
        activity={activity}
        type="TIMING"
        prop="startTime"
        propTitle="Start after or at"
        formatFn={value => moment(value).format('YYYY-MM-DD HH:mm')}
        mapping={mapping}
      />
    )
  }),
  endTimeTimeslots: mapping => ({
    title: 'End before or at:',
    key: 'endTime',
    dataIndex: null,
    render: activity => (
      <BaseActivityCol
        activity={activity}
        type="TIMING"
        prop="endTime"
        propTitle="End before or at"
        formatFn={value => moment(value).format('YYYY-MM-DD HH:mm')}
        mapping={mapping}
      />
    )
  }),
  length: mapping => ({
    title: 'Length',
    key: 'length',
    dataIndex: null,
    render: activity => (
      <BaseActivityCol
        activity={activity}
        type="TIMING"
        prop="length"
        propTitle="Length"
        mapping={mapping}
      />
    )
  })
};

export const TimingColumns = {
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
  ]
};
