import PropTypes from 'prop-types';
import { Cascader, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const MultiRowParameter = ({
  values,
  options,
  onUpdateValue,
  onAddParameter,
  onRemoveParameter,
  disabled,
}) => {
  const shouldAddParameterBtnBeDisabled =
    disabled || (values.length > 0 && values.some((v) => !v));

  return (
    <div className='multi-row-parameter--wrapper'>
      <div className='label'>Timing parameters</div>
      {(!values || !values.length) && (
        <div className='multi-row-parameter--empty'>
          No timing parameters added
        </div>
      )}
      {(values || []).map((value, idx) => (
        <div className='timing-mapping__row--wrapper' key={`value-${idx}`}>
          <div className='label'>{`Timing parameter ${idx + 1}`}</div>
          <Cascader
            options={options}
            value={value}
            onChange={(val) => onUpdateValue(idx, val)}
            placeholder='Select an element'
            getPopupContainer={() => document.getElementById('te-prefs-lib')}
            size='small'
            disabled={disabled}
          />
          <Button
            disabled={disabled}
            size='small'
            type='link'
            icon={<DeleteOutlined />}
            onClick={() => onRemoveParameter(idx)}
          />
        </div>
      ))}
      <div className='multi-row-parameter--add'>
        <Button
          type='default'
          size='small'
          onClick={onAddParameter}
          disabled={shouldAddParameterBtnBeDisabled}
        >
          Add timing parameter
        </Button>
      </div>
    </div>
  );
};

MultiRowParameter.propTypes = {
  values: PropTypes.array,
  options: PropTypes.array,
  onUpdateValue: PropTypes.func.isRequired,
  onAddParameter: PropTypes.func.isRequired,
  onRemoveParameter: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

MultiRowParameter.defaultProps = {
  values: [],
  options: [],
};

export default MultiRowParameter;
