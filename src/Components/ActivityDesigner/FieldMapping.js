import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Select } from 'antd';

// COMPONENTS
import MappingRow from './MappingRow';

// STYLES
import './Mapping.scss';

const FieldMapping = ({
  onChange,
  mapping,
  fieldOptions,
  mappingOptions,
  disabled,
}) => {
  // Callbacks
  const onChangeField = useCallback((newFieldMapping, oldField) => {
    const { fields: { [oldField]: __, ...otherFields } } = mapping;
    const { propSettings: { [oldField]: propSettings } } = mapping;
    const updatedMapping = {
      ...mapping,
      fields: {
        ...otherFields,
        ...newFieldMapping,
      },
      propSettings: {
        ...mapping.propSettings,
        [Object.keys(newFieldMapping)[0]]: propSettings,
      },
    };
    onChange(updatedMapping);
  }, [mapping, onChange]);

  const onChangeProps = useCallback((newPropSettings, fieldType) => {
    const updatedMapping = {
      ...mapping,
      propSettings: {
        ...mapping.propSettings,
        [fieldType]: newPropSettings,
      },
    };
    onChange(updatedMapping);
  }, [mapping, onChange]);

  const onAddField = useCallback(fieldType => {
    const updatedMapping = {
      ...mapping,
      fields: {
        ...mapping.fields,
        [fieldType]: null,
      },
      propSettings: {
        ...mapping.propSettings,
        [fieldType]: { mandatory: false },
      },
    };
    onChange(updatedMapping);
  }, [mapping, onChange]);

  const onRemoveField = useCallback(fieldType => {
    const { fields: { [fieldType]: __, ...remainingFields } } = mapping;
    const { propSettings: { [fieldType]: ___, ...remainingPropSettings } } = mapping;
    const updatedMapping = {
      ...mapping,
      fields: {
        ...remainingFields,
      },
      propSettings: {
        ...remainingPropSettings,
      },
    };
    onChange(updatedMapping);
  }, [mapping, onChange]);

  // Memoized values
  const fields = useMemo(() => _.get(mapping, 'fields', {}), [mapping]);
  const propSettings = useMemo(() => _.get(mapping, 'propSettings', {}), [mapping]);
  return (
    <div className='object-mapping--wrapper'>
      {(Object.keys(fields) || []).map(key => (
        <MappingRow
          disabled={disabled}
          key={key}
          teProp={key}
          formMapping={fields[key]}
          tePropSettings={propSettings[key]}
          tePropOptions={fieldOptions}
          mappingOptions={mappingOptions}
          onChangeMapping={newFieldMapping => onChangeField(newFieldMapping, key)}
          onChangeProps={newPropSettings => onChangeProps(newPropSettings, key)}
          onRemoveTEProp={() => onRemoveField(key)}
        />
      ))}
      <div className='object-mapping--add'>
        <span>Add field:&nbsp;</span>
        <Select
          disabled={disabled}
          placeholder='Add new field'
          value={undefined}
          onChange={onAddField}
          size='small'
          getPopupContainer={() => document.getElementById('te-prefs-lib')}
        >
          {(fieldOptions || []).map(el => (
            <Select.Option key={el.value} value={el.value}>{el.label}</Select.Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

FieldMapping.propTypes = {
  onChange: PropTypes.func.isRequired,
  mapping: PropTypes.object,
  fieldOptions: PropTypes.array,
  mappingOptions: PropTypes.array,
  disabled: PropTypes.bool,
};

FieldMapping.defaultProps = {
  mapping: {},
  typeOptions: [],
  mappingOptions: [],
  disabled: false,
};

export default FieldMapping;
