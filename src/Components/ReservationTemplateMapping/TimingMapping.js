import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Select, Cascader } from 'antd';

// HELPERS
import { getElementsForTimingMapping } from '../../Redux/Mapping/mappings.helpers';

// CONSTANTS
import { mappingTimingModes, mappingTimingModeProps } from '../../Constants/mappingTimingModes.constants';

// STYLES
import './Mapping.scss';

const TimingMapping = ({
  onChange,
  formSections,
  mapping,
  disabled,
}) => {
  const timingMode = useMemo(() => _.get(mapping, 'timing.mode', null), [mapping]);

  return (
    <React.Fragment>
      <div className="timing-mapping__row--wrapper">
        <div className="label">
          Mode
          <span className="is-required">(required)</span>
        </div>
        <Select
          value={_.get(mapping, 'timing.mode', null)}
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
      {timingMode === mappingTimingModes.EXACT && (
        <React.Fragment>
          <div className="timing-mapping__row--wrapper">
            <div className="label">
              Start time
              <span className="is-required">(required)</span>
            </div>
            <Cascader
              options={getElementsForTimingMapping[timingMode](formSections, mapping)}
              value={_.get(mapping, 'timing.startTime', null)}
              onChange={val => onChange('startTime', val)}
              placeholder="Select an element"
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size="small"
              disabled={disabled}
            />
          </div>
          <div className="timing-mapping__row--wrapper">
            <div className="label">
              End time
              <span className="is-required">(required)</span>
            </div>
            <Cascader
              options={getElementsForTimingMapping[timingMode](formSections, mapping)}
              value={_.get(mapping, 'timing.endTime', null)}
              onChange={val => onChange('endTime', val)}
              placeholder="Select an element"
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size="small"
              disabled={disabled}
            />
          </div>
        </React.Fragment>
      )}
      {timingMode === mappingTimingModes.TIMESLOTS && (
        <React.Fragment>
          <div className="timing-mapping__row--wrapper">
            <div className="label">
              Start on or after:
              <span className="is-required">(required)</span>
            </div>
            <Cascader
              options={getElementsForTimingMapping[timingMode](formSections, mapping)}
              value={_.get(mapping, 'timing.startTime', null)}
              onChange={val => onChange('startTime', val)}
              placeholder="Select an element"
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size="small"
              disabled={disabled}
            />
          </div>
          <div className="timing-mapping__row--wrapper">
            <div className="label">
              End on or before:
              <span className="is-required">(required)</span>
            </div>
            <Cascader
              options={getElementsForTimingMapping[timingMode](formSections, mapping)}
              value={_.get(mapping, 'timing.endTime', null)}
              onChange={val => onChange('endTime', val)}
              placeholder="Select an element"
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size="small"
              disabled={disabled}
            />
          </div>
          <div className="timing-mapping__row--wrapper">
            <div className="label">
              Length
              <span className="is-required">(required)</span>
            </div>
            <Cascader
              options={getElementsForTimingMapping[timingMode](formSections, mapping)}
              value={_.get(mapping, 'timing.length', null)}
              onChange={val => onChange('length', val)}
              placeholder="Select an element"
              getPopupContainer={() => document.getElementById('te-prefs-lib')}
              size="small"
              disabled={disabled}
            />
          </div>
        </React.Fragment>
      )}
      {timingMode === mappingTimingModes.SEQUENCE && (
        <React.Fragment>
          <div className="timing-mapping__row--wrapper">
            <div className="label">
              Start date
              <span className="is-required">(required)</span>
            </div>
          </div>
          <div className="timing-mapping__row--wrapper">
            <div className="label">
              End date
              <span className="is-required">(required)</span>
            </div>
          </div>
          <div className="timing-mapping__row--wrapper">
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
  onChange: PropTypes.func.isRequired,
  formSections: PropTypes.array.isRequired,
  mapping: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
};

TimingMapping.defaultProps = {
  disabled: false,
};

export default TimingMapping;
