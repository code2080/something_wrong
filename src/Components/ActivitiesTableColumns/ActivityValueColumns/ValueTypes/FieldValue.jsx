import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setActivityFilterOptions } from '../../../../Redux/Filters/filters.actions';
import { EActivityFilterType } from '../../../../Types/ActivityFilter.interface';

const FieldValue = ({ value, extId, activityId }) => {
  const dispatch = useDispatch();
  const { formId } = useParams();

  const formattedValue = Array.isArray(value) ? value.join(', ') : value;

  useEffect(() => {
    dispatch(setActivityFilterOptions({
      filterId: `${formId}_ACTIVITIES`,
      optionType: EActivityFilterType.FIELD,
      optionPayload: { extId, values: [{ value: `${extId}/${formattedValue}`, label: formattedValue }] },
      activityId,
    }));
  }, []);

  return formattedValue;
};

FieldValue.propTypes = {
  value: PropTypes.any,
  extId: PropTypes.string.isRequired,
  activityId: PropTypes.string.isRequired,
};

export default FieldValue;
