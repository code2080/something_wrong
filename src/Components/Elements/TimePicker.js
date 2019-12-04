import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon } from 'antd';

// STYLES
import './Pickers.scss';

const TimePicker = ({ value }) => (
  <div className="picker--wrapper">
    <div className="icon--wrapper">
      <Icon type="clock-circle" />
    </div>
    <div className="value--wrapper">
      {moment(value).format('HH:mm') || 'N/A'}
    </div>
  </div>
);

TimePicker.propTypes = {
  value: PropTypes.string,
};

TimePicker.defaultProps = {
  value: null,
};

export default TimePicker;
