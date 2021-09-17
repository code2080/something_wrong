import moment from 'moment';

// COMPONENTS
import BaseActivityCol from '../Base/BaseActivityCol';
import BaseActivityColOuter from '../Base/BaseActivityColOuter';
import SortableTableCell from '../../../DynamicTable/SortableTableCell';

// CONSTANTS
import {
  activityTimeModes,
  activityTimeModeProps,
} from '../../../../Constants/activityTimeModes.constants';
import TimingNameMap from '../../../../Constants/activityDesignTimingMap.constants';
import { DATE_TIME_FORMAT } from '../../../../Constants/common.constants';

const timingCols = {
  mode: (mapping) => ({
    title: 'Timing mode',
    key: 'mode',
    dataIndex: null,
    render: (activity) => (
      <SortableTableCell className={`mode_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='mode'
          propTitle={TimingNameMap.mode}
          formatFn={(value) => activityTimeModeProps[value].label}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: true,
  }),
  startTimeExact: (mapping) => ({
    title: 'Start time',
    key: 'startTime',
    dataIndex: null,
    width: 150,
    render: (activity) => (
      <SortableTableCell className={`startTime_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='startTime'
          propTitle={TimingNameMap.startTime}
          formatFn={(value) => moment(value).format(DATE_TIME_FORMAT)}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: true,
  }),
  endTimeExact: (mapping) => ({
    title: 'End time',
    key: 'endTime',
    width: 150,
    dataIndex: null,
    render: (activity) => (
      <SortableTableCell className={`endTime_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='endTime'
          propTitle={TimingNameMap.endTime}
          formatFn={(value) => moment(value).format(DATE_TIME_FORMAT)}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: true,
  }),
  startTimeTimeslots: (mapping) => ({
    title: 'Start after or at:',
    key: 'startTime',
    width: 200,
    dataIndex: null,
    render: (activity) => (
      <SortableTableCell className={`startTimeOrAt_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='startTime'
          propTitle='Start after or at'
          formatFn={(value) => moment(value).format(DATE_TIME_FORMAT)}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: true,
  }),
  endTimeTimeslots: (mapping) => ({
    title: 'End before or at:',
    width: 200,
    key: 'endTime',
    dataIndex: null,
    render: (activity) => (
      <SortableTableCell className={`endTimeOrAt_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='endTime'
          propTitle='End before or at'
          formatFn={(value) => moment(value).format(DATE_TIME_FORMAT)}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: true,
  }),
  length: (mapping) => ({
    title: 'Length',
    width: 70,
    key: 'length',
    dataIndex: null,
    render: (activity) => (
      <SortableTableCell className={`length_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='length'
          propTitle={TimingNameMap.length}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: true,
  }),
  padding: (mapping) => ({
    title: 'Padding',
    key: 'padding',
    width: 70,
    dataIndex: null,
    render: (activity) => (
      <SortableTableCell className={`padding_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='padding'
          propTitle={TimingNameMap.padding}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
  }),
  weekday: (mapping) => ({
    title: 'Weekday',
    key: 'weekday',
    width: 70,
    dataIndex: null,
    render: (activity) => (
      <SortableTableCell className={`weekday_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='weekday'
          propTitle={TimingNameMap.weekday}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: true,
  }),
  dateRanges: (mapping) => ({
    title: 'Date ranges',
    key: 'dateRanges',
    width: 120,
    dataIndex: null,
    render: (activity) => (
      <SortableTableCell className={`dateRanges_${activity._id}`}>
        <BaseActivityColOuter
          activity={activity}
          type='TIMING'
          prop='dateRanges'
          propTitle={TimingNameMap.dateRanges}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: true,
  }),
  time: (mapping) => ({
    title: 'Exact time',
    key: 'time',
    width: 120,
    dataIndex: null,
    render: (activity) => (
      <SortableTableCell className={`time_${activity._id}`}>
        <BaseActivityCol
          activity={activity}
          type='TIMING'
          prop='time'
          propTitle={TimingNameMap.time}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: true,
  }),
};

export const TimingColumns = {
  [activityTimeModes.EXACT]: (mapping) => [
    timingCols.startTimeExact(mapping),
    timingCols.endTimeExact(mapping),
  ],
  [activityTimeModes.TIMESLOTS]: (mapping) => [
    timingCols.startTimeTimeslots(mapping),
    timingCols.endTimeTimeslots(mapping),
    timingCols.length(mapping),
  ],
  [activityTimeModes.SEQUENCE]: (mapping) => {
    const { timing } = mapping;
    const mappedKeys = Object.keys(timing).filter(
      (key) => timing[key] && timing[key].length && key !== 'mode',
    );
    return mappedKeys
      .map((key) => timingCols?.[key]?.(mapping))
      .filter(Boolean);
  },
};
