import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select } from 'antd';

// SELECTORS
import { selectTimeslotsForSection } from '../../../Redux/Forms/forms.selectors';

// HELPERS
import { findTimeSlot } from '../../../Utils/sections.helpers';

const mapStateToProps = (state, ownProps) => {
  const { formId, sectionId } = ownProps.activity;
  return {
    timeslots: selectTimeslotsForSection(state)(formId, sectionId),
  };
};

/**
 * @todo
 * x) Make sure selection updates correctly, and updates across all values
 */

const TimeslotSelect = ({ timeslots, activity, value, setValue, onFinish }) => {
  const timeslot = useMemo(
    () => {
      const startTime = activity.timing.find(el => el.extId === 'startTime');
      const endTime = activity.timing.find(el => el.extId === 'endTime');
      return findTimeSlot(startTime.value, endTime.value, timeslots);
    },
    [activity, timeslots]
  );

  const onChangeCallback = value => {
    const selectedTimeslot = timeslots.find(el => el._id === value);
    onFinish([
      { extId: 'startTime', value: selectedTimeslot.startTime },
      { extId: 'endTime', value: selectedTimeslot.endTime },
    ]);
  };

  return (
    <Select
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      defaultValue={timeslot ? timeslot._id : undefined}
      style={{ width: 120 }}
      size="small"
      onChange={onChangeCallback}
    >
      {(timeslots || []).map(el => <Select.Option key={el._id} value={el._id}>{el.label}</Select.Option>)}
    </Select>
  );
};

TimeslotSelect.propTypes = {
  timeslots: PropTypes.array,
  activity: PropTypes.object.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};

TimeslotSelect.defaultProps = {
  timeslots: [],
  value: '',
};

export default connect(mapStateToProps, null)(TimeslotSelect);
