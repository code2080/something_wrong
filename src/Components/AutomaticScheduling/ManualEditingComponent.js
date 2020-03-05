import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, InputNumber } from 'antd';

// CONSTANTS
import { manualEditingModes } from '../../Constants/manualEditingModes.constants';

const ManualEditingComponent = ({ activityValue, manualEditingMode, onFinish, onCancel }) => {
  const [value, setValue] = useState(activityValue.value || undefined);

  const onFinishCallback = useCallback(() => {
    onFinish(value);
  }, [onFinish, value]);

  if (manualEditingMode === manualEditingModes.TEXT_INPUT)
    return (
      <Input
        size="small"
        allowClear
        onPressEnter={onFinishCallback}
        value={value}
        placeholder="Type here"
        onChange={e => setValue(e.target.value)}
      />
    );

  if (manualEditingMode === manualEditingModes.NUMBER_INPUT)
    return (
      <InputNumber
        size="small"
        allowClear
        onPressEnter={onFinishCallback}
        value={value}
        placeholder="Type here"
        onChange={e => setValue(e.target.value)}
      />
    );
  return null;
};

ManualEditingComponent.propTypes = {
  activityValue: PropTypes.object.isRequired,
  manualEditingMode: PropTypes.string.isRequired,
  onFinish: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ManualEditingComponent;
