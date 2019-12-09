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
      {(!value || !value[0] || !value[1]) ? 'N/A' : `${moment(value[0]).format('YYYY-MM-DD')} - ${moment(value[1]).format('YYYY-MM-DD')}`}
    </div>
  </div>
);

DatePicker.propTypes = {
  value: PropTypes.array,
};

DatePicker.defaultProps = {
  value: null,
};

export default DatePicker;
