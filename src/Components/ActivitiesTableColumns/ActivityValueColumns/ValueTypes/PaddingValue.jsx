import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { EActivityFilterType } from '../../../../Types/ActivityFilter.interface';
import { setActivityFilterOptions } from '../../../../Redux/Filters/filters.actions';

// HELPERS
import { minToHourMinDisplay } from '../../../../Utils/moment.helpers';

// STYLES
import './twoCol.scss';

const PaddingColumn = ({ value, title }) => {
  const { days, hours, minutes } = minToHourMinDisplay(value);
  return (
    <div className="two-col--col">
      <div className="title--row">
        {title}
      </div>
      <div className="value--row">
        {days ? `${days}d, ${hours}:${minutes}` : `${hours}:${minutes}`}
      </div>
    </div>
  );
}

PaddingColumn.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
};

const PaddingValue = ({ before, after, extId, activityId }) => {
  const dispatch = useDispatch();
  const { formId } = useParams();

  const formattedValue = useMemo(() => {
    const b = minToHourMinDisplay(before);
    const a = minToHourMinDisplay(after);
    if (b && !a) return `Before: ${b.days ? `${b.days}d, ${b.hours}:${b.minutes}` : `${b.hours}:${b.minutes}`}`;
    if (a && !b) return `After: ${a.days ? `${a.days}d, ${a.hours}:${a.minutes}` : `${a.hours}:${a.minutes}`}`;
    return `Before: ${b.days ? `${b.days}d, ${b.hours}:${b.minutes}` : `${b.hours}:${b.minutes}`}, after: ${a.days ? `${a.days}d, ${a.hours}:${a.minutes}` : `${a.hours}:${a.minutes}`}`;
  }, [before, after]);

  useEffect(() => {
    dispatch(setActivityFilterOptions({
      filterId: `${formId}_ACTIVITIES`,
      optionType: EActivityFilterType.TIMING,
      optionPayload: { extId, values: [{ value: `${extId}/${formattedValue}`, label: formattedValue }] },
      activityId,
    }));
  }, []);

  return (
    <div className="two-col--wrapper">
      {before && <PaddingColumn value={before} title="Before:" />}
      {after && <PaddingColumn value={after} title="After:" />}
    </div>
  );
};

PaddingValue.propTypes = {
  before: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  after: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  extId: PropTypes.string.isRequired,
  activityId: PropTypes.string.isRequired,
};

export default PaddingValue;
