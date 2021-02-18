import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// CONSTANTS
import { DATE_FORMAT } from '../../../../Constants/common.constants';

// STYLES
import './twoCol.scss';

const DateRangesColumn = ({ value, title }) => (
  <div className="two-col--col">
    <div className="title--row">
      {title}
    </div>
    <div className="value--row">
      {moment(value).format(DATE_FORMAT)}
    </div>
  </div>
);

DateRangesColumn.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
};

const DateRangesValue = ({ startTime, endTime }) => (
  <div className="two-col--wrapper">
    {startTime && <DateRangesColumn value={startTime} title="Start:" />}
    {endTime && <DateRangesColumn value={endTime} title="End:" />}
  </div>
);

DateRangesValue.propTypes = {
  startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DateRangesValue;
