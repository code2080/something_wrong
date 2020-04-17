import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import TextEdit from './TextEdit';
import NumberEdit from './NumberEdit';
import DateTimeEdit from './DateTimeEdit';

// CONSTANTS
import { manualEditingModes } from '../../Constants/manualEditingModes.constants';

const componentMapping = {
  [manualEditingModes.DATETIME_PICKER]: DateTimeEdit,
  [manualEditingModes.NUMBER_INPUT]: TextEdit,
  [manualEditingModes.TEXT_INPUT]: NumberEdit,
};

const ManualEditingComponent = ({ activityValue, manualEditingMode, onFinish, onCancel }) => {
  const [value, setValue] = useState(activityValue.value || undefined);

  const onFinishCallback = useCallback(() => {
    onFinish(value);
  }, [onFinish, value]);

  const ManualEditingComponent = componentMapping[manualEditingMode];
  if (!ManualEditingComponent || ManualEditingComponent == null) return null;

  return <ManualEditingComponent value={value} setValue={setValue} onFinish={onFinishCallback} />;
};

ManualEditingComponent.propTypes = {
  activityValue: PropTypes.object.isRequired,
  manualEditingMode: PropTypes.string.isRequired,
  onFinish: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ManualEditingComponent;
