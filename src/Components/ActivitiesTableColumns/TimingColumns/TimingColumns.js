import React from 'react';
import moment from 'moment';

// CONSTANTS
import {
  mappingTimingModes,
  mappingTimingModeProps
} from '../../../Constants/mappingTimingModes.constants';
import BaseActivityCol from '../BaseColumn/BaseActivityCol';
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
          type="TIMING"
          prop="mode"
          propTitle="Timing mode"
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
          type="TIMING"
          prop="startTime"
          propTitle="Start time"
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
          type="TIMING"
          prop="endTime"
          propTitle="End time"
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
          type="TIMING"
          prop="startTime"
          propTitle="Start after or at"
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
          type="TIMING"
          prop="endTime"
          propTitle="End before or at"
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
          type="TIMING"
          prop="length"
          propTitle="Length"
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: (a, b) => {
      return sortByElementHtml(`.length_${a._id}`, `.length_${b._id}`);
    },
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
