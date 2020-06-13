import React from 'react';
import PropTypes from 'prop-types';
import { Cascader, Button } from 'antd';

// COMPONENTS
import ExtraObjectValue from './ExtraObjectValue';

// STYLES
import './ExtraObjectRow.scss';

const ExtraObjectRow = ({
  formId,
  formInstanceId,
  rowIdx,
  availableObjects,
  value,
  onChange,
  onDelete
}) => {
  return (
    <div className="extra-object--wrapper">
      <Cascader
        options={availableObjects}
        value={value}
        onChange={val => onChange(rowIdx, val)}
        placeholder="Select an element"
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
        size="small"
        style={{ width: '200px' }}
      />
      <div className="extra-object__value--wrapper">
        <ExtraObjectValue extraObject={value} formId={formId} formInstanceId={formInstanceId} />
      </div>
      <div className="extra-object--delete">
        <Button type="danger" size="small" icon="delete" onClick={() => onDelete(rowIdx)} />
      </div>
    </div>
  );
};

ExtraObjectRow.propTypes = {
  formId: PropTypes.string.isRequired,
  formInstanceId: PropTypes.string.isRequired,
  rowIdx: PropTypes.number.isRequired,
  availableObjects: PropTypes.array.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

ExtraObjectRow.defaultProps = {
  value: [],
};

export default ExtraObjectRow;
