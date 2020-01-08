import React from 'react';
import PropTypes from 'prop-types';
import { Cascader } from 'antd';

// STYLES
import './ReservationTemplateMapping.scss';

const ObjectMapping = ({
  objectType,
  options,
  value,
  onSelectionChange,
  disabled,
  required,
}) => {
  return (
    <div className="object-mapping--wrapper">
      <div className="label">
        {objectType}
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

ObjectMapping.propTypes = {
  objectType: PropTypes.string.isRequired,
  options: PropTypes.array,
  value: PropTypes.array,
  onSelectionChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool.isRequired,
};

ObjectMapping.defaultProps = {
  options: [],
  value: [],
  disabled: false,
};

export default ObjectMapping;
