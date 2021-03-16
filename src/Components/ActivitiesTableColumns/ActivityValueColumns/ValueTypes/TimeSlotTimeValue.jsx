import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setActivityFilterOptions } from '../../../../Redux/Filters/filters.actions';
import { EActivityFilterType } from '../../../../Types/ActivityFilter.interface';

const TimeSlotTimeValue = ({ formattedValue, extId, activityId }) => {
  const dispatch = useDispatch();
  const { formId } = useParams();
  useEffect(() => {
    dispatch(setActivityFilterOptions({
      filterId: `${formId}_ACTIVITIES`,
      optionType: EActivityFilterType.TIMING,
      optionPayload: { extId, values: [{ value: `${extId}/${formattedValue}`, label: formattedValue }] },
      activityId
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <span>{formattedValue}</span>;
};

TimeSlotTimeValue.propTypes = {
  formattedValue: PropTypes.string.isRequired,
  extId: PropTypes.string.isRequired,
  activityId: PropTypes.string.isRequired,
};

export default TimeSlotTimeValue;
