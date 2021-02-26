import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EActivityFilterType } from '../../../../Types/ActivityFilter.interface';
import { setActivityFilterOptions } from '../../../../Redux/Filters/filters.actions';
import moment from 'moment';
import { weekdayEnums } from '../../../../Constants/weekDays.constants';

// TYPES
type Props = {
  value: string,
  extId: string,
  activityId: string,
};

const WeekdayValue = ({ value, extId, activityId }) => {
  const dispatch = useDispatch();
  const { formId }: { formId: string } = useParams();

  const formattedValue = value ? weekdayEnums[value] : 'N/A';

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

export default WeekdayValue;