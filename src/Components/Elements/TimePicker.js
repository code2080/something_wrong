import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon } from 'antd';
import { TIME_FORMAT } from '../../Constants/common.constants';

// STYLES
import './Pickers.scss';

const TimePicker = ({ value }) => (
  <div className='picker--wrapper'>
    <div className='icon--wrapper'>
      <Icon type='clock-circle' />
    </div>
    <div className='value--wrapper'>
      {moment(value).format(TIME_FORMAT) || 'N/A'}
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
