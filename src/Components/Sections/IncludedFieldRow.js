import React from 'react';
import PropTypes from 'prop-types';
import { Select, Button } from 'antd';

// STYLES
import './IncludedFieldRow.scss';

const IncludedFieldRow = ({
  value,
  fieldOptions,
  elementOptions,
  rowIdx,
  onChange,
  onDelete,
}) => {
  return (
    <div className="included-field--wrapper">
      <Select
        size="small"
        value={value.fieldExtId || undefined}
        onChange={val => onChange(rowIdx, { ...value, fieldExtId: val })}
        placeholder="Select a field"
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
        style={{ width: '200px' }}
      >
        {fieldOptions.map(el => (
          <Select.Option key={el.value} value={el.value}>{el.label}</Select.Option>
        ))}
      </Select>
      <Select
        value={value.element}
        onChange={val => onChange(rowIdx, { ...value, element: val })}
        placeholder="Select an element"
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
        size="small"
        style={{ width: '200px' }}
      >
        {elementOptions.map(el => (
          <Select.Option key={el.value} value={el.value}>{el.label}</Select.Option>
        ))}
      </Select>
      <Button type="danger" size="small" icon="delete" onClick={() => onDelete(rowIdx)} />
    </div>
  );
};

IncludedFieldRow.propTypes = {
  value: PropTypes.object,
  fieldOptions: PropTypes.array,
  elementOptions: PropTypes.array,
  rowIdx: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

IncludedFieldRow.defaultProps = {
  value: {},
  fieldOptions: [],
  mappingOptions: [],
};

export default IncludedFieldRow;
