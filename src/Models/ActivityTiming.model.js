import { mappingTimingModes } from '../Constants/mappingTimingModes.constants';

export class ActivityTiming {
  mode;

  startDate;

  endDate;

  startTime;

  endTime;

  length;

  constructor({
    mode,
    startDate = [],
    endDate = [],
    startTime =[],
    endTime = [],
    length = [],
  }) {
    this.mode = mode || mappingTimingModes.EXACT;
    this.startDate = startDate;
    this.endDate = endDate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.length = length;
  }
}
