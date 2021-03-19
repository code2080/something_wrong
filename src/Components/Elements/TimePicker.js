import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ClockCircleOutlined } from '@ant-design/icons';
import { TIME_FORMAT } from '../../Constants/common.constants';

// STYLES
import './Pickers.scss';

const TimePicker = ({ value }) => {
  const _value = useMemo(() => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'string') return moment(value).format(TIME_FORMAT);
    return moment().startOf('day').add(value, 'minutes').format(TIME_FORMAT);
  }, [value]);
  return (
    <div className='picker--wrapper'>
      <div className='icon--wrapper'>
        <ClockCircleOutlined />
      </div>
      <div className='value--wrapper'>{_value}</div>
    </div>
  );
};

TimePicker.propTypes = {
  value: PropTypes.string,
};

TimePicker.defaultProps = {
  value: null,
};

export default TimePicker;
