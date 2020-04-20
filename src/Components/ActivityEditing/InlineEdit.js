import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import TextEdit from './InlineEdits/TextEdit';
import NumberEdit from './InlineEdits/NumberEdit';
import DateTimeEdit from './InlineEdits/DateTimeEdit';

// CONSTANTS
import { activityActions } from '../../Constants/activityActions.constants';

const componentMapping = {
  [activityActions.FREE_TEXT_OVERRIDE]: TextEdit,
  [activityActions.NUMBER_OVERRIDE]: NumberEdit,
  [activityActions.EXACT_TIME_OVERRIDE]: DateTimeEdit,
};

const ManualEditingComponent = ({ activityValue, action, onFinish, onCancel }) => {
  const [value, setValue] = useState(activityValue.value || undefined);

  const onFinishCallback = useCallback(() => {
    onFinish(value);
  }, [onFinish, value]);

  const InlineComponent = componentMapping[action];
  if (!InlineComponent || InlineComponent == null) return null;

  return <InlineComponent value={value} setValue={setValue} onFinish={onFinishCallback} />;
};

ManualEditingComponent.propTypes = {
  activityValue: PropTypes.object.isRequired,
  action: PropTypes.string.isRequired,
  onFinish: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ManualEditingComponent;
