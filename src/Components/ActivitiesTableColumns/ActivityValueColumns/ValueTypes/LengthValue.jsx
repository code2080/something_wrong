import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setActivityFilterOptions } from '../../../../Redux/Filters/filters.actions';
import { EActivityFilterType } from '../../../../Types/ActivityFilter.interface';

// HELPERS
import { minToHourMinDisplay } from '../../../../Utils/moment.helpers';

const LengthValue = ({ value, extId, activityId }) => {
  const dispatch = useDispatch();
  const { formId } = useParams();

  const { days, hours, minutes } = minToHourMinDisplay(value);

  const formattedValue = days ? `${days}d, ${hours}:${minutes}` : `${hours}:${minutes}`;

  useEffect(() => {
    dispatch(setActivityFilterOptions({
      filterId: `${formId}_ACTIVITIES`,
      optionType: EActivityFilterType.TIMING,
      optionPayload: { extId, values: [{ value: `${extId}/${formattedValue}`, label: formattedValue }] },
      activityId,
    }));
  }, []);

  return formattedValue;
};

LengthValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  extId: PropTypes.string.isRequired,
  activityId: PropTypes.string.isRequired,
};

export default LengthValue;
