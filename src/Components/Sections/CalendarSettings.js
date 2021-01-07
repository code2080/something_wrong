import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// COMPONENTS
import CalendarTimeslots from './CalendarTimeslots';

// STYLES
import './CalendarSettings.scss';
import { DATE_FORMAT, TIME_FORMAT } from '../../Constants/common.constants';
import DateTime from '../Common/DateTime';

const CalendarSettings = ({ calendarSettings }) => (
  <div
    className="calendar-settings--wrapper"
  >
    <div className="setting--wrapper">
      <div className="setting--label">Date range:</div>
      <div className="setting--value">
        <DateTime value={[calendarSettings.startDate, calendarSettings.endDate]} />
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
            <DateTime value={calendarSettings.disabledUntil} format={TIME_FORMAT} />
          </div>
          <div className="setting__label--right">Until:</div>
          <div className="setting--value">
            <DateTime value={calendarSettings.disabledFrom} format={TIME_FORMAT} />
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
