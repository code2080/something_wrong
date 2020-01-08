import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

// HELPERS
import { getSchedulingPayloadForReservationValue } from '../../Redux/Reservations/reservations.helpers';

const BaseReservationColValue = ({ reservationValue, reservation, formatFn }) => {
  const schedulingPayload = getSchedulingPayloadForReservationValue(reservationValue, reservation, formatFn);
  if (schedulingPayload.tooltip)
    return (
      <Tooltip
        title={schedulingPayload.tooltip}
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
      >
        <span>{schedulingPayload.formattedValue}</span>
      </Tooltip>
    );

  return (
    <span>{schedulingPayload.formattedValue}</span>
  );
};

BaseReservationColValue.propTypes = {
  reservationValue: PropTypes.object.isRequired,
  reservation: PropTypes.object,
  formatFn: PropTypes.func,
};

BaseReservationColValue.defaultProps = {
  formatFn: val => val,
};

export default BaseReservationColValue;

/**
 * const formattedValueObject = useMemo(() => {
    // Special case: start time and time slots
    if (reservationValue.extId === 'startTime' && timingMode === mappingTimingModes.TIMESLOTS)
      return formatTimeSlotStartTime(reservationValue, dependentValues);
    // Special case: end time and time slots
    if (reservationValue.extId === 'endTime' && timingMode === mappingTimingModes.TIMESLOTS)
      return formatTimeSlotEndTime(reservationValue, dependentValues);
    // Special case: filters
    if (reservationValue.submissionValueType === submissionValueTypes.FILTER)
      return formatFilters(reservationValue);
    return { value: reservationValue.value ? formatFn(reservationValue.value) : 'N/A' };
  }, [reservationValue, timingMode, dependentValues]);

  import { mappingTimingModes } from '../../Constants/mappingTimingModes.constants';
import { submissionValueTypes } from '../../Constants/submissionValueTypes.constants';

const formatTimeSlotStartTime = (reservationValue, dependentValues) => {
  if (!reservationValue.submissionValue[0])
    return {
      value: 'Missing data',
      tooltip: 'Start time is missing, please input the value manually to calculate a start time range'
    };

  const _length = dependentValues.find(el => el.extId === 'length');
  const _endTime = dependentValues.find(el => el.extId === 'endTime');
  if (!_length || !_endTime || !_length.value || !_endTime.submissionValue[0])
    return {
      value: 'Missing data',
      tooltip: 'End time or length is missing, please input these values manually to calculate a start time range'
    };
  const startTime = reservationValue.submissionValue[0];
  const length = _length.value;
  const endTime = _endTime.submissionValue[0];

  return { value: `${moment(startTime).format('YYYY-MM-DD')} ${moment(startTime).format('HH:mm')} - ${moment(endTime).subtract(length, 'hours').format('HH:mm')}` };
};

const formatTimeSlotEndTime = (reservationValue, dependentValues) => {
  if (!reservationValue.submissionValue[0])
    return {
      value: 'Missing data',
      tooltip: 'End time is missing, please input the value manually to calculate an end time range'
    };

  const _length = dependentValues.find(el => el.extId === 'length');
  const _startTime = dependentValues.find(el => el.extId === 'startTime');
  if (!_length || !_startTime || !_length.value || !_startTime.submissionValue[0])
    return {
      value: 'Missing data',
      tooltip: 'Start time or length is missing, please input these values manually to calculate a start time range'
    };
  const endTime = reservationValue.submissionValue[0];
  const length = _length.value;
  const startTime = _startTime.submissionValue[0];

  return { value: `${moment(startTime).format('YYYY-MM-DD')} ${moment(startTime).add(length, 'hours').format('HH:mm')} - ${moment(endTime).format('HH:mm')}` };
};

const formatFilters = reservationValue => {
  if (reservationValue.value) return { value: reservationValue.value };
  if (
    !reservationValue.submissionValue[0] ||
    !reservationValue.submissionValue[0].value ||
    !reservationValue.submissionValue[0].value[0]
  )
    return 'N/A';
  return {
    value: reservationValue.submissionValue[0].value[0],
    tooltip: `Field: ${reservationValue.submissionValue[0].field}`,
  };
};
 */
