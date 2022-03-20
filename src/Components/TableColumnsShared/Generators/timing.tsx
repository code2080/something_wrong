import moment from 'moment';

// COMPONENTS
import BaseActivityColWrapper from 'Components/DEPR_ActivitiesTableColumns/ActivityValueColumns/Base/BaseActivityColWrapper';
import BaseActivityColOuter from 'Components/DEPR_ActivitiesTableColumns/ActivityValueColumns/Base/BaseActivityColOuter';

// CONSTANTS
import {
  activityTimeModes,
  activityTimeModeProps,
} from '../../../Constants/activityTimeModes.constants';
import TimingNameMap from '../../../Constants/activityDesignTimingMap.constants';
import { DATE_TIME_FORMAT } from '../../../Constants/common.constants';
import { EActivitySortingKey } from 'Types/Activity/ActivitySortingKey.enum';

const timingCols = {
  mode: (mapping) => ({
    title: 'Timing mode',
    key: 'metadata.mode',
    dataIndex: null,
    render: (activity, activityIndex) => (
      <BaseActivityColWrapper
        activity={activity}
        activityIndex={activityIndex}
        type='TIMING'
        prop='mode'
        propTitle={TimingNameMap.mode}
        formatFn={(value) => activityTimeModeProps[value].label}
        mapping={mapping}
      />
    ),
    sorter: true,
  }),
  startTimeExact: (mapping) => ({
    title: 'Start time',
    key: EActivitySortingKey.START_TIME,
    dataIndex: null,
    render: (activity, activityIndex) => {
      return (
        <BaseActivityColWrapper
          activity={activity}
          activityIndex={activityIndex}
          type='TIMING'
          prop='startTime'
          propTitle={TimingNameMap.startTime}
          formatFn={(value) => moment(value).format(DATE_TIME_FORMAT)}
          mapping={mapping}
        />
      );
    },
    sorter: true,
  }),
  endTimeExact: (mapping) => ({
    title: 'End time',
    key: EActivitySortingKey.END_TIME,
    dataIndex: null,
    render: (activity, activityIndex) => (
      <BaseActivityColWrapper
        activity={activity}
        activityIndex={activityIndex}
        type='TIMING'
        prop='endTime'
        propTitle={TimingNameMap.endTime}
        formatFn={(value) => moment(value).format(DATE_TIME_FORMAT)}
        mapping={mapping}
      />
    ),
    sorter: true,
  }),
  startTimeTimeslots: (mapping) => ({
    title: 'Start after or at:',
    key: 'metadata.startTimeInMinute',
    dataIndex: null,
    render: (activity, activityIndex) => (
      <BaseActivityColWrapper
        activity={activity}
        activityIndex={activityIndex}
        type='TIMING'
        prop='startTime'
        propTitle='Start after or at'
        formatFn={(value) => moment(value).format(DATE_TIME_FORMAT)}
        mapping={mapping}
      />
    ),
  }),
  endTimeTimeslots: (mapping) => ({
    title: 'End before or at:',
    key: 'metadata.endTimeInMinute',
    dataIndex: null,
    render: (activity, activityIndex) => (
      <BaseActivityColWrapper
        activity={activity}
        activityIndex={activityIndex}
        type='TIMING'
        prop='endTime'
        propTitle='End before or at'
        formatFn={(value) => moment(value).format(DATE_TIME_FORMAT)}
        mapping={mapping}
      />
    ),
  }),
  length: (mapping) => ({
    title: 'Duration',
    key: EActivitySortingKey.LENGTH,
    dataIndex: null,
    render: (activity, activityIndex) => (
      <BaseActivityColWrapper
        activity={activity}
        activityIndex={activityIndex}
        type='TIMING'
        prop='length'
        propTitle={TimingNameMap.length}
        mapping={mapping}
      />
    ),
    sorter: true,
  }),
  padding: (mapping) => ({
    title: 'Padding',
    key: 'metadata.padding',
    dataIndex: null,
    render: (activity, activityIndex) => (
      <BaseActivityColWrapper
        activity={activity}
        activityIndex={activityIndex}
        type='TIMING'
        prop='padding'
        propTitle={TimingNameMap.padding}
        mapping={mapping}
      />
    ),
  }),
  weekday: (mapping) => ({
    title: 'Weekday',
    key: EActivitySortingKey.WEEKDAY,
    dataIndex: null,
    render: (activity, activityIndex) => (
      <BaseActivityColWrapper
        activity={activity}
        activityIndex={activityIndex}
        type='TIMING'
        prop='weekday'
        propTitle={TimingNameMap.weekday}
        mapping={mapping}
      />
    ),
    sorter: true,
  }),
  dateRanges: (mapping) => ({
    title: 'Date ranges',
    key: EActivitySortingKey.DATE_RANGES,
    dataIndex: null,
    render: (activity) => (
      <BaseActivityColOuter
        activity={activity}
        type='TIMING'
        prop='dateRanges'
        propTitle={TimingNameMap.dateRanges}
        mapping={mapping}
      />
    ),
    sorter: true,
  }),
  time: (mapping) => ({
    title: 'Exact time',
    key: EActivitySortingKey.TIME,
    dataIndex: null,
    render: (activity, activityIndex) => (
      <BaseActivityColWrapper
        activity={activity}
        activityIndex={activityIndex}
        type='TIMING'
        prop='time'
        propTitle={TimingNameMap.time}
        mapping={mapping}
      />
    ),
    sorter: true,
  }),
};

export const GenerateTimingColumns = {
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
