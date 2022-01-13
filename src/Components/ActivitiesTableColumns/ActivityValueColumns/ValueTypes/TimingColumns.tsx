import moment from 'moment';

// COMPONENTS
import BaseActivityColWrapper from '../Base/BaseActivityColWrapper';
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
    key: 'metadata.mode',
    dataIndex: null,
    render: (activity, activityIndex) => (
      <SortableTableCell className={`mode_${activity._id}`}>
        <BaseActivityColWrapper
          activity={activity}
          activityIndex={activityIndex}
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
  startTimeExact: (mapping, columnPrefix, renderer) => ({
    title: 'Start time',
    key: 'metadata.startTimeInDate',
    dataIndex: null,
    render: (activity, activityIndex) => {
      return (
        <SortableTableCell className={`startTime_${activity._id}`}>
          <BaseActivityColWrapper
            columnPrefix={columnPrefix}
            renderer={renderer}
            activity={activity}
            activityIndex={activityIndex}
            type='TIMING'
            prop='startTime'
            propTitle={TimingNameMap.startTime}
            formatFn={(value) => moment(value).format(DATE_TIME_FORMAT)}
            mapping={mapping}
          />
        </SortableTableCell>
      );
    },
    sorter: true,
  }),
  endTimeExact: (mapping, columnPrefix, renderer) => ({
    title: 'End time',
    key: 'metadata.endTimeInDate',
    dataIndex: null,
    render: (activity, activityIndex) => (
      <SortableTableCell className={`endTime_${activity._id}`}>
        <BaseActivityColWrapper
          columnPrefix={columnPrefix}
          renderer={renderer}
          activity={activity}
          activityIndex={activityIndex}
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
  startTimeTimeslots: (mapping, columnPrefix, renderer) => ({
    title: 'Start after or at:',
    key: 'metadata.startTimeInMinute',
    dataIndex: null,
    render: (activity, activityIndex) => (
      <SortableTableCell className={`startTimeOrAt_${activity._id}`}>
        <BaseActivityColWrapper
          columnPrefix={columnPrefix}
          renderer={renderer}
          activity={activity}
          activityIndex={activityIndex}
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
  endTimeTimeslots: (mapping, columnPrefix, renderer) => ({
    title: 'End before or at:',
    key: 'metadata.endTimeInMinute',
    dataIndex: null,
    render: (activity, activityIndex) => (
      <SortableTableCell className={`endTimeOrAt_${activity._id}`}>
        <BaseActivityColWrapper
          columnPrefix={columnPrefix}
          renderer={renderer}
          activity={activity}
          activityIndex={activityIndex}
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
  length: (mapping, columnPrefix, renderer) => ({
    title: 'Length',
    key: 'metadata.length',
    dataIndex: null,
    render: (activity, activityIndex) => (
      <SortableTableCell className={`length_${activity._id}`}>
        <BaseActivityColWrapper
          columnPrefix={columnPrefix}
          renderer={renderer}
          activity={activity}
          activityIndex={activityIndex}
          type='TIMING'
          prop='length'
          propTitle={TimingNameMap.length}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
    sorter: true,
  }),
  padding: (mapping, columnPrefix, renderer) => ({
    title: 'Padding',
    key: 'metadata.padding',
    dataIndex: null,
    render: (activity, activityIndex) => (
      <SortableTableCell className={`padding_${activity._id}`}>
        <BaseActivityColWrapper
          columnPrefix={columnPrefix}
          renderer={renderer}
          activity={activity}
          activityIndex={activityIndex}
          type='TIMING'
          prop='padding'
          propTitle={TimingNameMap.padding}
          mapping={mapping}
        />
      </SortableTableCell>
    ),
  }),
  weekday: (mapping, columnPrefix, renderer) => ({
    title: 'Weekday',
    key: 'metadata.weekday',
    dataIndex: null,
    render: (activity, activityIndex) => (
      <SortableTableCell className={`weekday_${activity._id}`}>
        <BaseActivityColWrapper
          columnPrefix={columnPrefix}
          renderer={renderer}
          activity={activity}
          activityIndex={activityIndex}
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
    key: 'metadata.dateRanges',
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
  time: (mapping, columnPrefix, renderer) => ({
    title: 'Exact time',
    key: 'metadata.time',
    dataIndex: null,
    render: (activity, activityIndex) => (
      <SortableTableCell className={`time_${activity._id}`}>
        <BaseActivityColWrapper
          columnPrefix={columnPrefix}
          renderer={renderer}
          activity={activity}
          activityIndex={activityIndex}
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
  [activityTimeModes.EXACT]: (mapping, columnPrefix, render) => [
    timingCols.startTimeExact(mapping, columnPrefix, render),
    timingCols.endTimeExact(mapping, columnPrefix, render),
  ],
  [activityTimeModes.TIMESLOTS]: (mapping, columnPrefix, render) => [
    timingCols.startTimeTimeslots(mapping, columnPrefix, render),
    timingCols.endTimeTimeslots(mapping, columnPrefix, render),
    timingCols.length(mapping, columnPrefix, render),
  ],
  [activityTimeModes.SEQUENCE]: (mapping, columnPrefix, render) => {
    const { timing } = mapping;
    const mappedKeys = Object.keys(timing).filter(
      (key) => timing[key] && timing[key].length && key !== 'mode',
    );
    return mappedKeys
      .map((key) => timingCols?.[key]?.(mapping, columnPrefix, render))
      .filter(Boolean);
  },
};
