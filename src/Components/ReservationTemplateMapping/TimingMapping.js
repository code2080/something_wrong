import React from 'react';
import PropTypes from 'prop-types';
import { Select, Cascader } from 'antd';

// HELPERS
import { timingOptions } from '../../Redux/Mapping/mappings.helpers';

// CONSTANTS
import { mappingTimingModes, mappingTimingModeProps } from '../../Constants/mappingTimingModes.constants';

const TimingMapping = ({
  mode,
  startDate,
  endDate,
  startTime,
  endTime,
  length,
  onChange,
  formSections,
  mapping,
  disabled,
}) => {
  return (
    <React.Fragment>
      <div className="timing-mapping--wrapper">
        <div className="label">
          Mode
          <span className="is-required">(required)</span>
        </div>
        <Select
          value={mode}
          onChange={val => onChange('mode', val)}
          size="small"
          getPopupContainer={() => document.getElementById('te-prefs-lib')}
          disabled={disabled}
        >
          {Object.keys(mappingTimingModeProps).map(mode => (
            <Select.Option key={mode} value={mode}>{mappingTimingModeProps[mode].label}</Select.Option>
          ))}
        </Select>
      </div>
      {mode === mappingTimingModes.EXACT && (
        <React.Fragment>
          <div className="timing-mapping--wrapper">
            <div className="label">
              Start time
              <span className="is-required">(required)</span>
            </div>
            <Cascader
              options={timingOptions[mode](formSections, mapping)}
              value={startTime}
              onChange={val => onChange('startTime', val)}
              placeholder="Select an element"
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size="small"
              disabled={disabled}
            />
          </div>
          <div className="timing-mapping--wrapper">
            <div className="label">
              End time
              <span className="is-required">(required)</span>
            </div>
            <Cascader
              options={timingOptions[mode](formSections, mapping)}
              value={endTime}
              onChange={val => onChange('endTime', val)}
              placeholder="Select an element"
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size="small"
              disabled={disabled}
            />
          </div>
        </React.Fragment>
      )}
      {mode === mappingTimingModes.TIMESLOTS && (
        <React.Fragment>
          <div className="timing-mapping--wrapper">
            <div className="label">
              Start on or after:
              <span className="is-required">(required)</span>
            </div>
            <Cascader
              options={timingOptions[mode](formSections, mapping)}
              value={startTime}
              onChange={val => onChange('startTime', val)}
              placeholder="Select an element"
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size="small"
              disabled={disabled}
            />
          </div>
          <div className="timing-mapping--wrapper">
            <div className="label">
              End on or before:
              <span className="is-required">(required)</span>
            </div>
            <Cascader
              options={timingOptions[mode](formSections, mapping)}
              value={endTime}
              onChange={val => onChange('endTime', val)}
              placeholder="Select an element"
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size="small"
              disabled={disabled}
            />
          </div>
          <div className="timing-mapping--wrapper">
            <div className="label">
              Length
              <span className="is-required">(required)</span>
            </div>
            <Cascader
              options={timingOptions[mode](formSections, mapping)}
              value={length}
              onChange={val => onChange('length', val)}
              placeholder="Select an element"
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size="small"
              disabled={disabled}
            />
          </div>
        </React.Fragment>
      )}
      {mode === mappingTimingModes.SEQUENCE && (
        <React.Fragment>
          <div className="timing-mapping--wrapper">
            <div className="label">
              Start date
              <span className="is-required">(required)</span>
            </div>
          </div>
          <div className="timing-mapping--wrapper">
            <div className="label">
              End date
              <span className="is-required">(required)</span>
            </div>
          </div>
          <div className="timing-mapping--wrapper">
            <div className="label">
              Length
              <span className="is-required">(required)</span>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

TimingMapping.propTypes = {
  mode: PropTypes.string.isRequired,
  startDate: PropTypes.array,
  endDate: PropTypes.array,
  startTime: PropTypes.array,
  endTime: PropTypes.array,
  length: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  formSections: PropTypes.array.isRequired,
  mapping: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
};

TimingMapping.defaultProps = {
  disabled: false,
};

export default TimingMapping;
