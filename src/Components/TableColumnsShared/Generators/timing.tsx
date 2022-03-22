// COMPONENTS
import ColumnWrapper from '../ActivityValue/ColumnWrapper';

// CONSTANTS
import { activityTimeModes } from '../../../Constants/activityTimeModes.constants';
import { EActivitySortingKey } from 'Types/Activity/ActivitySortingKey.enum';
import { TActivity } from 'Types/Activity/Activity.type';

type TimingValue = (mapping: any) => {
  title: string;
  key: string;
  dataIndex: string | null;
  render: (activity: TActivity, actvityIndex: number) => JSX.Element;
};

const timingCols: Record<string, TimingValue> = {
  mode: (mapping: any) => ({
    title: 'Timing mode',
    key: 'metadata.mode',
    dataIndex: null,
    render: (activity, activityIndex) => (
      <ColumnWrapper
        activity={activity}
        type='timing'
        prop='mode'
        mapping={mapping}
        key={activityIndex}
      />
    ),
    sorter: true,
  }),
  startTimeExact: (mapping) => ({
    title: 'Start time',
    key: EActivitySortingKey.START_TIME,
    dataIndex: null,
    render: (activity, activityIndex) => (
      <ColumnWrapper
        activity={activity}
        type='timing'
        prop='startTime'
        mapping={mapping}
        key={activityIndex}
      />
    ),
    sorter: true,
  }),
  endTimeExact: (mapping) => ({
    title: 'End time',
    key: EActivitySortingKey.END_TIME,
    dataIndex: null,
    render: (activity, activityIndex) => (
      <ColumnWrapper
        activity={activity}
        type='timing'
        prop='endTime'
        mapping={mapping}
        key={activityIndex}
      />
    ),
    sorter: true,
  }),
  startTimeTimeslots: (mapping) => ({
    title: 'Start after or at:',
    key: 'metadata.startTimeInMinute',
    dataIndex: null,
    render: (activity, activityIndex) => (
      <ColumnWrapper
        activity={activity}
        type='timing'
        prop='startTime'
        mapping={mapping}
        key={activityIndex}
      />
    ),
  }),
  endTimeTimeslots: (mapping) => ({
    title: 'End before or at:',
    key: 'metadata.endTimeInMinute',
    dataIndex: null,
    render: (activity, activityIndex) => (
      <ColumnWrapper
        activity={activity}
        type='timing'
        prop='endTime'
        mapping={mapping}
        key={activityIndex}
      />
    ),
  }),
  length: (mapping) => ({
    title: 'Duration',
    key: EActivitySortingKey.LENGTH,
    dataIndex: null,
    render: (activity, activityIndex) => (
      <ColumnWrapper
        activity={activity}
        type='timing'
        prop='length'
        mapping={mapping}
        key={activityIndex}
      />
    ),
    sorter: true,
  }),
  padding: (mapping) => ({
    title: 'Padding',
    key: 'metadata.padding',
    dataIndex: null,
    render: (activity, activityIndex) => (
      <ColumnWrapper
        activity={activity}
        type='timing'
        prop='padding'
        mapping={mapping}
        key={activityIndex}
      />
    ),
  }),
  weekday: (mapping) => ({
    title: 'Weekday',
    key: EActivitySortingKey.WEEKDAY,
    dataIndex: null,
    render: (activity, activityIndex) => (
      <ColumnWrapper
        activity={activity}
        type='timing'
        prop='weekday'
        mapping={mapping}
        key={activityIndex}
      />
    ),
    sorter: true,
  }),
  dateRanges: (mapping) => ({
    title: 'Date ranges',
    key: EActivitySortingKey.DATE_RANGES,
    dataIndex: null,
    render: (activity, activityIndex) => (
      <ColumnWrapper
        activity={activity}
        type='timing'
        prop='dateRanges'
        mapping={mapping}
        key={activityIndex}
      />
    ),
    sorter: true,
  }),
  time: (mapping) => ({
    title: 'Exact time',
    key: EActivitySortingKey.TIME,
    dataIndex: null,
    render: (activity, activityIndex) => (
      <ColumnWrapper
        activity={activity}
        type='timing'
        prop='time'
        mapping={mapping}
        key={activityIndex}
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
