import React from 'react';
import PropTypes from 'prop-types';
import { TimePicker, Input } from 'antd';
import moment from 'moment';

const CalendarTimeslot = ({ timeslot }) => (
  <div className='calendar-timeslot--wrapper'>
    <div className='timeslot-setting--wrapper'>
      <div className='setting--label'>Start time:</div>
      <TimePicker
        size='small'
        value={moment(timeslot.startTime)}
        disabled
      />
    </div>
    <div className='timeslot-setting--wrapper'>
      <div className='setting--label'>End time:</div>
      <TimePicker
        size='small'
        value={moment(timeslot.endTime)}
        disabled
      />
    </div>
    <div className='timeslot-setting--wrapper'>
      <div className='setting--label'>Name:</div>
      <Input
        size='small'
        value={timeslot.label}
        placeholder='Add a label'
        disabled
      />
    </div>
  </div>
);

CalendarTimeslot.propTypes = {
  timeslot: PropTypes.object.isRequired,
};

export default CalendarTimeslot;
