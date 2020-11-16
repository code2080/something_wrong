import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon } from 'antd';
import { DATE_FORMAT } from '../../Constants/common.constants';

// STYLES
import './Pickers.scss';

const DatePicker = ({ value }) => (
  <div className="picker--wrapper">
    <div className="icon--wrapper">
      <Icon type="calendar" />
    </div>
    <div className="value--wrapper">
      {moment(value).format(DATE_FORMAT) || 'N/A'}
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
