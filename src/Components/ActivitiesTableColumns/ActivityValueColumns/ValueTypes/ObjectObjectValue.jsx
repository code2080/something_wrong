import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

// ACTIONS
import { setActivityFilterOptions } from '../../../../Redux/Filters/filters.actions';
import { EActivityFilterType } from '../../../../Types/ActivityFilter.interface';

const standardizeValue = value => Array.isArray(value) ? value : [value];
const ObjectObjectValue = ({ value, extId, activityId }) => {
  const dispatch = useDispatch();
  const { formId } = useParams();
  const stdValue = standardizeValue(value);
  const formattedValue = stdValue.join(', ');
  useEffect(() => {
    dispatch(setActivityFilterOptions({
      filterId: `${formId}_ACTIVITIES`,
      optionType: EActivityFilterType.OBJECT,
      optionPayload: { extId, values: stdValue.map(el => ({ value: `${extId}/${el}`, label: el })) },
      activityId,
    }));
  }, []);
  return formattedValue;
};

ObjectObjectValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  extId: PropTypes.string.isRequired,
  activityId: PropTypes.string.isRequired,
};

export default ObjectObjectValue;
