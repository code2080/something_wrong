import React, { useMemo } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Icon, Tooltip } from 'antd';

// STYLES
import './Pickers.scss';

const findTimeSlot = (startTime, endTime, timeslots) => {
  const _startTime = moment(startTime).format('HH:mm');
  const _endTime = moment(endTime).format('HH:mm');
  const timeslotIdx = (timeslots || []).findIndex(
    el =>
      moment(el.startTime).format('HH:mm') === _startTime &&
        moment(el.endTime).format('HH:mm') === _endTime
  );
  if (timeslotIdx > -1) return timeslots[timeslotIdx];
  return null;
};

const TimeSlotColumn = ({ event, timeslots }) => {
  const timeslot = useMemo(
    () => findTimeSlot(event.startTime, event.endTime, timeslots),
    [event, timeslots]
  );
  const tooltipTitle = useMemo(() => {
    if (timeslot)
      return `Timeslot ${timeslot.label}; Start time: ${moment(timeslot.startTime).format('HH:mm')}, end time: ${moment(timeslot.endTime).format('HH:mm')}`;
    return `Timeslot could not be found`;
  }, [timeslot]);

  return (
    <Tooltip
      title={tooltipTitle}
      mouseEnterDelay={0.8}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      <div className="picker--wrapper">
        <div className="icon--wrapper">
          <Icon type="clock-circle" />
        </div>
        <div className="value--wrapper">
          {timeslot ? timeslot.label : 'N/A'}
        </div>
      </div>
    </Tooltip>
  );
};

TimeSlotColumn.propTypes = {
  event: PropTypes.object.isRequired,
  timeslots: PropTypes.array.isRequired,
};

export default TimeSlotColumn;
