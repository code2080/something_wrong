import React from 'react';
import PropTypes from 'prop-types';
import { Cascader } from 'antd';

// STYLES
import './ReservationTemplateMapping.scss';

const FieldMapping = ({
  fieldType,
  options,
  value,
  onSelectionChange,
  disabled,
  required,
}) => {
  return (
    <div className="field-mapping--wrapper">
      <div className="label">
        {fieldType}
        {required && (
          <span className="is-required">(required)</span>
        )}
      </div>
      <Cascader
        options={options}
        value={value}
        onChange={onSelectionChange}
        placeholder="Select an element"
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
        size="small"
        disabled={disabled}
      />
    </div>
  );
};

FieldMapping.propTypes = {
  fieldType: PropTypes.string.isRequired,
  options: PropTypes.array,
  value: PropTypes.array,
  onSelectionChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool.isRequired,
};

FieldMapping.defaultProps = {
  options: [],
  value: [],
  disabled: false,
};

export default FieldMapping;
