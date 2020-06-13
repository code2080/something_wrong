import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// COMPONENTS
import CalendarTimeslots from './CalendarTimeslots';

// STYLES
import './CalendarSettings.scss';

const CalendarSettings = ({ calendarSettings }) => (
  <div
    className="calendar-settings--wrapper"
  >
    <div className="setting--wrapper">
      <div className="setting--label">Date range:</div>
      <div className="setting--value">
        {`${moment.utc(calendarSettings.startDate).format('YYYY-MM-DD')} - ${moment.utc(calendarSettings.endDate).format('YYYY-MM-DD')}`}
      </div>
    </div>
    <div className="setting--wrapper">
      <div className="setting--label">Use timeslots:</div>
      <div className="setting--value">
        {calendarSettings.useTimeslots ? 'Yes' : 'No'}
      </div>
    </div>
    {calendarSettings.useTimeslots && (
      <CalendarTimeslots timeslots={calendarSettings.timeslots} />
    )}
    {!calendarSettings.useTimeslots && (
      <React.Fragment>
        <div className="setting--wrapper">
          <div className="setting--label">Allow reservations from:</div>
          <div
            className="setting--value"
            style={{ marginRight: '1.2rem' }}
          >
            {moment(calendarSettings.disabledUntil).format('HH:mm')}
          </div>
          <div className="setting__label--right">Until:</div>
          <div className="setting--value">
            {moment(calendarSettings.disabledFrom).format('HH:mm')}
          </div>
        </div>
        <div className="setting--wrapper">
          <div className="setting--label">Step length:</div>
          <div className="setting--value">{calendarSettings.step}</div>
        </div>
      </React.Fragment>
    )}
  </div>
);

CalendarSettings.propTypes = {
  calendarSettings: PropTypes.object.isRequired,
};

export default CalendarSettings;
