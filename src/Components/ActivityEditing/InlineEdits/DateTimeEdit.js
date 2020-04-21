import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePicker } from 'antd';

const DateTimeEdit = ({ value, setValue, onFinish }) => (
  <DatePicker
    getCalendarContainer={() => document.getElementById('te-prefs-lib')}
    value={value != null ? moment.utc(value) : null}
    showTime
    size="small"
    allowClear={false}
    onChange={val => setValue(val.toISOString())}
    onOk={() => onFinish()}
  />
);

DateTimeEdit.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};

DateTimeEdit.defaultProps = {
  value: '',
};

export default DateTimeEdit;
