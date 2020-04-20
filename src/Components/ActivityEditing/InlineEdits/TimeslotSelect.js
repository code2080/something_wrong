import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select } from 'antd';

// SELECTORS
import { selectTimeslotsForSection } from '../../../Redux/Forms/forms.selectors';

const mapStateToProps = (state, ownProps) => {
  const { formId, sectionId } = ownProps.activity;
  return {
    timeslots: selectTimeslotsForSection(state)(formId, sectionId),
  };
};

/**
 * @todo
 * x) Make sure value is relevant annd right option in dropdown is selected to begin with
 * x) Make sure selection updates correctly, and updates across all values
 */

const TimeslotSelect = ({ timeslots, value, setValue, onFinish }) => {
  const onChangeCallback = value => {
    setValue(value);
    onFinish();
  };

  return (
    <Select
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      defaultValue={value}
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
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};

TimeslotSelect.defaultProps = {
  timeslots: [],
  value: '',
};

export default connect(mapStateToProps, null)(TimeslotSelect);
