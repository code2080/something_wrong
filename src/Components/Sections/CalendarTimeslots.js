import React from 'react';
import PropTypes from 'prop-types';
import { Card, Empty } from 'antd';

// COMPONENTS
import CalendarTimeslot from './CalendarTimeslot';

// STYLES
import './CalendarTimeslots.scss';

const CalendarTimeslots = ({ timeslots }) => (
  <div className='calendar-timeslots--wrapper'>
    <Card size='small' title='Timeslots'>
      {timeslots &&
        timeslots.map((el, timeslotIdx) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className='calendar-timeslot--outer' key={timeslotIdx}>
            <CalendarTimeslot timeslot={el} />
          </div>
        ))}
      {timeslots && timeslots.length === 0 && (
        <Empty description='No timeslots have been added' />
      )}
    </Card>
  </div>
);

CalendarTimeslots.propTypes = {
  timeslots: PropTypes.array,
};

CalendarTimeslots.defaultProps = {
  timeslots: [],
};

export default CalendarTimeslots;
