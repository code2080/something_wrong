import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EActivityFilterType } from '../../../../Types/ActivityFilter.interface';
import { setActivityFilterOptions } from '../../../../Redux/Filters/filters.actions';
import moment from 'moment';
import { DATE_TIME_FORMAT } from '../../../../Constants/common.constants';

// TYPES
type Props = {
  value: string,
  extId: string,
  activityId: string,
};

const TimeValue = ({ value, extId, activityId }: Props) => {
  const dispatch = useDispatch();
  const { formId }: { formId: string } = useParams();

  const formattedValue = value ? moment(value).format(DATE_TIME_FORMAT) : 'N/A';

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

export default TimeValue;
