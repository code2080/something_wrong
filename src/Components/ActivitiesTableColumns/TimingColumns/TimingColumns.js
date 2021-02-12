import React from 'react';
import moment from 'moment';

// CONSTANTS
import {
  mappingTimingModes,
  mappingTimingModeProps
} from '../../../Constants/mappingTimingModes.constants';
import BaseActivityCol from '../BaseColumn/BaseActivityCol';
import BaseActivityColOuter from '../BaseColumn/BaseActivityColOuter';
import { DATE_TIME_FORMAT } from '../../../Constants/common.constants';
import SortableTableCell from '../../DynamicTable/SortableTableCell';
import { sortByElementHtml } from '../../../Utils/sorting.helpers';

const timingCols = {
  mode: mapping => ({
    title: 'Timing mode',
    key: 'mode',
    dataIndex: null,
    render: activity => (
      <SortableTableCell className={`mode_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='mode'
          propTitle='Timing mode'
          formatFn={value => mappingTimingModeProps[value].label}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: (a, b) => {
      return sortByElementHtml(`.mode_${a._id}`, `.mode_${b._id}`);
    },
  }),
  startTimeExact: mapping => ({
    title: 'Start time',
    key: 'startTime',
    dataIndex: null,
    render: activity => (
      <SortableTableCell className={`startTime_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='startTime'
          propTitle='Start time'
          formatFn={value => moment(value).format(DATE_TIME_FORMAT)}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: (a, b) => {
      return sortByElementHtml(`.startTime_${a._id}`, `.startTime_${b._id}`);
    },
  }),
  endTimeExact: mapping => ({
    title: 'End time',
    key: 'endTime',
    dataIndex: null,
    render: activity => (
      <SortableTableCell className={`endTime_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='endTime'
          propTitle='End time'
          formatFn={value => moment(value).format(DATE_TIME_FORMAT)}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: (a, b) => {
      return sortByElementHtml(`.endTime_${a._id}`, `.endTime_${b._id}`);
    },
  }),
  startTimeTimeslots: mapping => ({
    title: 'Start after or at:',
    key: 'startTime',
    dataIndex: null,
    render: activity => (
      <SortableTableCell className={`startTimeOrAt_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='startTime'
          propTitle='Start after or at'
          formatFn={value => moment(value).format(DATE_TIME_FORMAT)}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: (a, b) => {
      return sortByElementHtml(`.startTimeOrAt_${a._id}`, `.startTimeOrAt_${b._id}`);
    },
  }),
  endTimeTimeslots: mapping => ({
    title: 'End before or at:',
    key: 'endTime',
    dataIndex: null,
    render: activity => (
      <SortableTableCell className={`endTimeOrAt_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='endTime'
          propTitle='End before or at'
          formatFn={value => moment(value).format(DATE_TIME_FORMAT)}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: (a, b) => {
      return sortByElementHtml(`.endTimeOrAt_${a._id}`, `.endTimeOrAt_${b._id}`);
    },
  }),
  length: mapping => ({
    title: 'Length',
    key: 'length',
    dataIndex: null,
    render: activity => (
      <SortableTableCell className={`length_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='length'
          propTitle='Length'
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: (a, b) => sortByElementHtml(`.length_${a._id}`, `.length_${b._id}`),
  }),
  padding: mapping => ({
    title: 'Padding',
    key: 'padding',
    dataIndex: null,
    render: activity => (
      <SortableTableCell className={`padding_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='padding'
          propTitle='Padding'
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: (a, b) => sortByElementHtml(`.padding_${a._id}`, `.padding_${b._id}`),
  }),
  weekday: mapping => ({
    title: 'Weekday',
    key: 'weekday',
    dataIndex: null,
    render: activity => (
      <SortableTableCell className={`weekday_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='weekday'
          propTitle='Weekday'
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: (a, b) => sortByElementHtml(`.weekday_${a._id}`, `.weekday_${b._id}`),
  }),
  dateRanges: mapping => ({
    title: 'Date ranges',
    key: 'dateRanges',
    dataIndex: null,
    render: activity => (
      <SortableTableCell className={`dateRanges_${activity._id}`}>
        <BaseActivityColOuter
          activity={activity}
          type='TIMING'
          prop='dateRanges'
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: (a, b) => sortByElementHtml(`.dateRanges_${a._id}`, `.dateRanges_${b._id}`),
  }),
  time: mapping => ({
    title: 'Exact time',
    key: 'time',
    dataIndex: null,
    render: activity => (
      <SortableTableCell className={`time_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='time'
          propTitle='Exact time'
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: (a, b) => sortByElementHtml(`.time_${a._id}`, `.time_${b._id}`),
  }),
};

export const TimingColumns = {
  [mappingTimingModes.EXACT]: mapping => [
    timingCols.startTimeExact(mapping),
    timingCols.endTimeExact(mapping)
  ],
  [mappingTimingModes.TIMESLOTS]: mapping => [
    timingCols.startTimeTimeslots(mapping),
    timingCols.endTimeTimeslots(mapping),
    timingCols.length(mapping)
  ],
  [mappingTimingModes.SEQUENCE]: mapping => [
    timingCols.length(mapping),
    timingCols.padding(mapping),
    timingCols.weekday(mapping),
    timingCols.dateRanges(mapping),
    timingCols.time(mapping),
  ],
};
