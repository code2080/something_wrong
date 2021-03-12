
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePicker } from 'antd';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '../../../Constants/common.constants';

const DateTimeEdit = ({ value, setValue, onFinish }) => (
  <DatePicker
    getCalendarContainer={() => document.getElementById('te-prefs-lib')}
    value={value != null ? moment(value) : null}
    showTime={{ format: TIME_FORMAT }}
    format={DATE_TIME_FORMAT}
    size='small'
    allowClear={false}
    onChange={val => setValue(val.toISOString())}
    onOk={() => onFinish()}
  />
);

DateTimeEdit.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired
};

DateTimeEdit.defaultProps = {
  value: ''
};

export default DateTimeEdit;
