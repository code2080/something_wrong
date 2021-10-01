import React from 'react';
import BaseActivityCol, {
  baseActivityColPropTypes,
  baseActivityColDefaultProps,
} from './BaseActivityCol';
import { ConflictType } from 'Models/JointTeachingGroup.model';

const BaseActivityColWrapper = (props) => {
  const { activityIndex, ...rest } = props;
  const columnPrefix = (activityValue) => {
    if (typeof props.columnPrefix === 'function')
      return props.columnPrefix(
        ConflictType.TIMING,
        [props.activity, activityIndex],
        [[activityValue], 0],
      );
  };

  const renderer = (activityValue) => {
    if (typeof props.renderer === 'function')
      return props.renderer(
        ConflictType.TIMING,
        props.activity,
        activityValue.extId,
      );
  };

  return (
    <BaseActivityCol
      {...rest}
      columnPrefix={columnPrefix}
      renderer={renderer}
    ></BaseActivityCol>
  );
};

BaseActivityColWrapper.propTypes = baseActivityColPropTypes;
BaseActivityColWrapper.defaultProps = baseActivityColDefaultProps;
export default BaseActivityColWrapper;
