import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CalendarOutlined } from '@ant-design/icons';
import { DATE_FORMAT } from '../../Constants/common.constants';

// STYLES
import './Pickers.scss';

const DatePicker = ({ value }) => (
  <div className='picker--wrapper'>
    <div className='icon--wrapper'>
      <CalendarOutlined />
    </div>
    <div className='value--wrapper'>
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
