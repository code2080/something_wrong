import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Select } from 'antd';

// COMPONENTS
import MappingRow from './MappingRow';

// STYLES
import './Mapping.scss';

const ObjectMapping = ({
  onChange,
  mapping,
  typeOptions,
  mappingOptions,
  disabled,
}) => {
  // Callbacks
  const onChangeObject = useCallback(
    (newTypeMapping, oldType) => {
      const {
        objects: { [oldType]: __, ...otherObjs },
      } = mapping;
      const {
        propSettings: { [oldType]: propSettings },
      } = mapping;
      const updatedMapping = {
        ...mapping,
        objects: {
          ...otherObjs,
          ...newTypeMapping,
        },
        propSettings: {
          ...mapping.propSettings,
          [Object.keys(newTypeMapping)[0]]: propSettings,
        },
      };
      onChange(updatedMapping);
    },
    [mapping, onChange],
  );

  const onAddObject = useCallback(
    (objectType) => {
      const updatedMapping = {
        ...mapping,
        objects: {
          ...mapping.objects,
          [objectType]: null,
        },
        propSettings: {
          ...mapping.propSettings,
          [objectType]: { mandatory: false },
        },
      };
      onChange(updatedMapping);
    },
    [mapping, onChange],
  );

  const onRemoveObject = useCallback(
    (objectType) => {
      const {
        objects: { [objectType]: __, ...remainingObjects },
      } = mapping;
      const {
        propSettings: { [objectType]: ___, ...remainingPropSettings },
      } = mapping;
      const updatedMapping = {
        ...mapping,
        objects: {
          ...remainingObjects,
        },
        propSettings: {
          ...remainingPropSettings,
        },
      };
      onChange(updatedMapping);
    },
    [mapping, onChange],
  );

  // Memoized values
  const objects = useMemo(() => _.get(mapping, 'objects', {}), [mapping]);
  return (
    <div className='object-mapping--wrapper'>
      {(Object.keys(objects) || []).map((key) => (
        <MappingRow
          disabled={disabled}
          key={key}
          teProp={key}
          formMapping={objects[key]}
          tePropOptions={typeOptions}
          mappingOptions={mappingOptions}
          onChangeMapping={(newTypeMapping) =>
            onChangeObject(newTypeMapping, key)
          }
          onRemoveTEProp={() => onRemoveObject(key)}
        />
      ))}
      <div className='object-mapping--add'>
        <span>Add object:&nbsp;</span>
        <Select
          disabled={disabled}
          placeholder='Add new object'
          value={null}
          onChange={onAddObject}
          size='small'
          getPopupContainer={() => document.getElementById('te-prefs-lib')}
        >
          {(typeOptions || []).map((el) => (
            <Select.Option key={el.value} value={el.value}>
              {el.label}
            </Select.Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

ObjectMapping.propTypes = {
  onChange: PropTypes.func.isRequired,
  mapping: PropTypes.object,
  typeOptions: PropTypes.array,
  mappingOptions: PropTypes.array,
  disabled: PropTypes.bool,
};

ObjectMapping.defaultProps = {
  mapping: {},
  typeOptions: [],
  mappingOptions: [],
  disabled: false,
};

export default ObjectMapping;
