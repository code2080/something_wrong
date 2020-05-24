import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Select, Cascader, Switch, Button } from 'antd';

const MappingRow = ({
  teProp,
  formMapping,
  tePropSettings,
  tePropOptions,
  mappingOptions,
  onChangeMapping,
  onChangeProps,
  onRemoveTEProp,
  disabled,
}) => {
  // Callbacks
  const onChangeTEPropCallback = useCallback(
    _teProp => onChangeMapping({ [_teProp]: formMapping }), [formMapping, onChangeMapping]
  );
  const onChangeFormMapping = useCallback(
    _formMapping => onChangeMapping({ [teProp]: _formMapping }, [teProp, onChangeMapping])
  );
  const onChangePropsCallback = useCallback(
    checked => onChangeProps({ mandatory: checked }), [onChangeProps]
  );

  return (
    <div className="object-mapping-row--wrapper">
      <div className="object-mapping-row--type">
        <Select
          disabled={disabled}
          value={teProp}
          onChange={onChangeTEPropCallback}
          getPopupContainer={() => document.getElementById('te-prefs-lib')}
          size="small"
        >
          {(tePropOptions || []).map(el => (
            <Select.Option key={el.value} value={el.value}>{el.label}</Select.Option>
          ))}
        </Select>
      </div>
      <Cascader
        disabled={disabled}
        options={mappingOptions}
        value={formMapping}
        onChange={onChangeFormMapping}
        placeholder="Select an element"
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
        size="small"
      />
      <div className="object-mapping-row--props">
        <span>Is mandatory:&nbsp;</span>
        <Switch
          checked={tePropSettings.mandatory}
          onChange={onChangePropsCallback}
          size="small"
          disabled={disabled}
        />
      </div>
      <div className="object-mapping-row--delete">
        <Button
          disabled={disabled}
          size="small"
          type="link"
          icon="delete"
          onClick={onRemoveTEProp}
        />
      </div>
    </div>
  );
};

MappingRow.propTypes = {
  teProp: PropTypes.string.isRequired,
  formMapping: PropTypes.array,
  tePropSettings: PropTypes.object,
  tePropOptions: PropTypes.array,
  mappingOptions: PropTypes.array,
  onChangeMapping: PropTypes.func.isRequired,
  onChangeProps: PropTypes.func.isRequired,
  onRemoveTEProp: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

MappingRow.defaultProps = {
  formMapping: null,
  props: { mandatory: false, },
  tePropOptions: [],
  mappingOptions: [],
  disabled: false,
};

export default MappingRow;
