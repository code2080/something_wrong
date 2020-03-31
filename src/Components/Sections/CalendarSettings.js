import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Collapse,
  DatePicker,
  TimePicker,
  Switch,
  InputNumber,
} from 'antd';

// COMPONENTS
import CalendarTimeslots from './CalendarTimeslots';

// STYLES
import './CalendarSettings.scss';

const CalendarSettings = ({ calendarSettings }) => {
  console.log(calendarSettings);
  return (
    <div
      className="calendar-settings--wrapper"
      style={{ marginBottom: '1.2rem' }}
    >
      <Collapse defaultActiveKey={[]} size="small">
        <Collapse.Panel header="Calendar Settings" key="1">
          <div className="setting--wrapper">
            <div className="setting--label">Date range:</div>
            <DatePicker.RangePicker
              size="small"
              value={[
                moment.utc(calendarSettings.startDate),
                moment.utc(calendarSettings.endDate),
              ]}
              disabled
            />
          </div>
          <div className="setting--wrapper">
            <div className="setting--label">Use timeslots:</div>
            <Switch
              size="small"
              checked={calendarSettings.useTimeslots}
              disabled
            />
          </div>
          {calendarSettings.useTimeslots && (
            <CalendarTimeslots timeslots={calendarSettings.timeslots} />
          )}
          {!calendarSettings.useTimeslots && (
            <React.Fragment>
              <div className="setting--wrapper">
                <div className="setting--label">Disable until:</div>
                <TimePicker
                  size="small"
                  value={moment(calendarSettings.disabledUntil)}
                  disabled
                  format="HH:mm"
                  style={{ marginRight: '1.2rem' }}
                />
                <div className="setting--label">Disable from:</div>
                <TimePicker
                  size="small"
                  value={moment(calendarSettings.disabledFrom)}
                  disabled
                  format="HH:mm"
                />
              </div>
              <div className="setting--wrapper">
                <div className="setting--label">Step length:</div>
                <InputNumber
                  size="small"
                  value={calendarSettings.step}
                  disabled
                />
              </div>
            </React.Fragment>
          )}
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

CalendarSettings.propTypes = {
  calendarSettings: PropTypes.object.isRequired,
};

export default CalendarSettings;
