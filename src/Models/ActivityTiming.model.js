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
  hasTiming;

  constructor(
    {
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
    },
    settings = {},
  ) {
    const { hasTiming, useTimeslots } = settings;
    if (!mode) {
      if (!hasTiming) this.mode = activityTimeModes.SEQUENCE;
      else
        this.mode = useTimeslots
          ? activityTimeModes.TIMESLOTS
          : activityTimeModes.EXACT;
    } else {
      this.mode = mode;
    }

    this.startDate = startDate;
    this.endDate = endDate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.length = length;
    this.padding = padding;
    this.dateRanges = dateRanges;
    this.weekday = weekday;
    this.time = time;
    this.hasTiming = hasTiming;
  }
}
