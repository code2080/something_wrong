import PropTypes from 'prop-types';

const TimeSlotTimeValue = ({ formattedValue }) => {
  return <span>{formattedValue}</span>;
};

TimeSlotTimeValue.propTypes = {
  formattedValue: PropTypes.string.isRequired,
};

export default TimeSlotTimeValue;
