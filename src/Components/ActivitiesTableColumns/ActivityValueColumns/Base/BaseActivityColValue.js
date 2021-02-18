import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

// HELPERS

// COMPONENTS
import { renderComponent } from '../Helpers/rendering';
import { activityValueStatuses } from '../../../../Constants/activityStatuses.constants';

const BaseActivityColValue = ({
  activityValue,
  activity,
}) => {
  const component = useMemo(() => renderComponent(activityValue, activity), [activityValue, activity]);
  if (component.status === activityValueStatuses.READY_FOR_SCHEDULING && component.renderedComponent)
    return component.renderedComponent;
  return <span>Missing data</span>;
};

BaseActivityColValue.propTypes = {
  activityValue: PropTypes.object.isRequired,
  activity: PropTypes.object,
};

BaseActivityColValue.defaultProps = {
  formatFn: val => val,
};

export default BaseActivityColValue;
