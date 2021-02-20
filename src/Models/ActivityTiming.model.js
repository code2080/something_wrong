import { activityTimeModes } from '../Constants/activityTimeModes.constants';

export class ActivityTiming {
  mode;
  startDate;
  endDate;
  startTime;
  endTime;
  length;
  padding;
  dateRanges;
  weekday;
  time;

  constructor ({
    mode,
    startDate = [],
    endDate = [],
    startTime = [],
    endTime = [],
    length = [],
    padding = [],
    dateRanges = [],
    weekday = [],
    time = [],
  }) {
    this.mode = mode || activityTimeModes.EXACT;
    this.startDate = startDate;
    this.endDate = endDate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.length = length;
    this.padding = padding;
    this.dateRanges = dateRanges;
    this.weekday = weekday;
    this.time = time;
  }
}
