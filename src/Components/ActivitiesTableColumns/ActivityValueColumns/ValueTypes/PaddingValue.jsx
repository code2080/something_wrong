import React from 'react';
import PropTypes from 'prop-types';

// HELPERS
import { minToHourMinDisplay } from '../../../../Utils/moment.helpers';

// STYLES
import './twoCol.scss';

const PaddingColumn = ({ value, title }) => {
  const { days, hours, minutes } = minToHourMinDisplay(value);
  return (
    <div className='two-col--col'>
      <div className='title--row'>
        {title}
      </div>
      <div className='value--row'>
        {days ? `${days}d, ${hours}:${minutes}` : `${hours}:${minutes}`}
      </div>
    </div>
  );
};

PaddingColumn.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
};

const PaddingValue = ({ before, after }) => {
  return (
    <div className='two-col--wrapper'>
      {before && <PaddingColumn value={before} title='Before:' />}
      {after && <PaddingColumn value={after} title='After:' />}
    </div>
  );
};

PaddingValue.propTypes = {
  before: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  after: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PaddingValue;
