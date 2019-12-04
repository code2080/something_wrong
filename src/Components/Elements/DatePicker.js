import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon } from 'antd';

// STYLES
import './Pickers.scss';

const DatePicker = ({ value }) => (
  <div className="picker--wrapper">
    <div className="icon--wrapper">
      <Icon type="calendar" />
    </div>
    <div className="value--wrapper">
      {moment(value).format('YYYY-MM-DD') || 'N/A'}
    </div>
  </div>
);

DatePicker.propTypes = {
  value: PropTypes.string,
};

DatePicker.defaultProps = {
  value: null,
};

export default DatePicker;
