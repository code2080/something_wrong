import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Select, Switch, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
// HELPERS
import { ensureBackwardsCompatibleValueRow } from '../../Utils/activities.helpers';
import CascaderWithTooltip from 'Components/CascaderWithTooltip/CascaderWithTooltip';

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
  // Memos
  const _mappedValues = useMemo(
    () => ensureBackwardsCompatibleValueRow(formMapping),
    [formMapping],
  );

  // Callbacks
  const onChangeTEPropCallback = useCallback(
    (_teProp) => onChangeMapping({ [_teProp]: formMapping }),
    [formMapping, onChangeMapping],
  );
  const onChangeFormMapping = useCallback(
    (el, idx) => {
      if (!el || !el[0])
        return onChangeMapping({
          [teProp]: [
            ..._mappedValues.slice(0, idx),
            ..._mappedValues.slice(idx + 1),
          ],
        });
      onChangeMapping({
        [teProp]: [
          ..._mappedValues.slice(0, idx),
          el,
          ..._mappedValues.slice(idx + 1),
        ],
      });
    },
    [teProp, onChangeMapping, _mappedValues],
  );

  const onChangePropsCallback = useCallback(
    (checked) => onChangeProps({ mandatory: checked }),
    [onChangeProps],
  );
  const addElementProp = useCallback(() => {
    return onChangeMapping({ [teProp]: [..._mappedValues, []] });
  }, [_mappedValues, onChangeMapping, teProp]);

  return (
    <div className='object-mapping-row--wrapper'>
      <div className='object-mapping-row--type'>
        <Select
          disabled={disabled}
          value={teProp}
          onChange={onChangeTEPropCallback}
          getPopupContainer={() =>
            document.getElementById('te-prefs-lib') as HTMLElement
          }
          size='small'
        >
          {(tePropOptions || []).map((el) => (
            <Select.Option key={el.value} value={el.value}>
              {el.label}
            </Select.Option>
          ))}
        </Select>
      </div>
      {_mappedValues &&
        _mappedValues.map((el, idx) => (
          <CascaderWithTooltip
            key={`mapper-${idx}`}
            disabled={disabled}
            options={mappingOptions}
            value={el}
            onChange={(val) => onChangeFormMapping(val, idx)}
            placeholder='Select an element'
            getPopupContainer={() =>
              document.getElementById('te-prefs-lib') as HTMLElement
            }
            size='small'
            style={{ width: '400px', marginRight: '8px' }}
          />
        ))}
      <div className='object-mapping-row--add'>
        <Button
          size='small'
          type='link'
          onClick={addElementProp}
          disabled={disabled}
        >
          + Add element
        </Button>
      </div>
      <div className='object-mapping-row--props'>
        <span>Is mandatory:&nbsp;</span>
        <Switch
          checked={tePropSettings.mandatory}
          onChange={onChangePropsCallback}
          size='small'
          disabled={disabled}
          aria-label='Is mandatory'
        />
      </div>
      <Button
        disabled={disabled}
        size='small'
        type='link'
        danger
        icon={<DeleteOutlined />}
        onClick={onRemoveTEProp}
      />
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
  tePropSettings: { mandatory: false },
  tePropOptions: [],
  mappingOptions: [],
  disabled: false,
};

export default MappingRow;
