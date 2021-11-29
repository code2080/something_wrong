import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import { activityActions } from '../../Constants/activityActions.constants';
import TextEdit from './InlineEdits/TextEdit';
import NumberEdit from './InlineEdits/NumberEdit';
import DateTimeEdit from './InlineEdits/DateTimeEdit';
import TimeslotSelect from './InlineEdits/TimeslotSelect';

// CONSTANTS

const componentMapping = {
  [activityActions.FREE_TEXT_OVERRIDE]: TextEdit,
  [activityActions.NUMBER_OVERRIDE]: NumberEdit,
  [activityActions.EXACT_TIME_OVERRIDE]: DateTimeEdit,
  [activityActions.TIMESLOT_CHANGE_OVERRIDE]: TimeslotSelect,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InlineEdit = ({
  activity,
  activityValue,
  action,
  onFinish,
  onCancel: _,
}) => {
  const [value, setValue] = useState(activityValue.value || undefined);

  const onFinishCallback = useCallback(
    (finishVal) => {
      const valToUse = finishVal ?? value;
      onFinish(valToUse);
    },
    [onFinish, value],
  );

  const InlineComponent = componentMapping[action];
  if (!InlineComponent || InlineComponent == null) return null;

  return (
    <InlineComponent
      activity={activity}
      value={value}
      setValue={setValue}
      onFinish={onFinishCallback}
    />
  );
};

InlineEdit.propTypes = {
  activity: PropTypes.object.isRequired,
  activityValue: PropTypes.object.isRequired,
  action: PropTypes.string.isRequired,
  onFinish: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default InlineEdit;
