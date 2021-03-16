import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setActivityFilterOptions } from '../../../../Redux/Filters/filters.actions';
import { EActivityFilterType } from '../../../../Types/ActivityFilter.interface';

// CONSTANTS
import { DATE_FORMAT } from '../../../../Constants/common.constants';

// STYLES
import './twoCol.scss';

const DateRangesColumn = ({ value, title }) => (
  <div className='two-col--col'>
    <div className='title--row'>
      {title}
    </div>
    <div className='value--row'>
      {moment(value).format(DATE_FORMAT)}
    </div>
  </div>
);

DateRangesColumn.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
};

const DateRangesValue = ({ startTime, endTime, extId, activityId }) => {
  const dispatch = useDispatch();
  const { formId } = useParams();

  const formattedValue = `${moment(startTime).format(DATE_FORMAT)} - ${moment(endTime).format(DATE_FORMAT)}`;

  useEffect(() => {
    dispatch(setActivityFilterOptions({
      filterId: `${formId}_ACTIVITIES`,
      optionType: EActivityFilterType.TIMING,
      optionPayload: { extId, values: [{ value: `${extId}/${formattedValue}`, label: formattedValue }] },
      activityId,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='two-col--wrapper'>
      {startTime && <DateRangesColumn value={startTime} title='Start:' />}
      {endTime && <DateRangesColumn value={endTime} title='End:' />}
    </div>
  );
};

DateRangesValue.propTypes = {
  startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  extId: PropTypes.string.isRequired,
  activityId: PropTypes.string.isRequired,
};

export default DateRangesValue;
