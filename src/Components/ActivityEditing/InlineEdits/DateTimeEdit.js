import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePicker } from 'antd';
import {
  DATE_TIME_FORMAT,
  TIME_FORMAT,
} from '../../../Constants/common.constants';
import { useEffect, useState } from 'react';

const DateTimeEdit = ({ value, onFinish }) => {
  const [newValue, setNewValue] = useState();
  useEffect(() => {
    setNewValue(value != null ? moment(value) : null);
  }, [value]);
  return (
    <DatePicker
      getCalendarContainer={() => document.getElementById('te-prefs-lib')}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      value={newValue}
      showTime={{ format: TIME_FORMAT }}
      format={DATE_TIME_FORMAT}
      size='small'
      allowClear={false}
      onChange={(value) => onFinish(value)}
      onSelect={(value) => setNewValue(value)}
      open
      onOpenChange={(open) => {
        if (!open) {
          onFinish(newValue);
        }
      }}
      onOk={(newValue) => onFinish(newValue)}
      editable={false}
    />
  );
};

DateTimeEdit.propTypes = {
  value: PropTypes.string,
  onFinish: PropTypes.func.isRequired,
};

DateTimeEdit.defaultProps = {
  value: '',
};

export default DateTimeEdit;
