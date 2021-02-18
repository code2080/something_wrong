import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// COMPONENTS
import BaseActivityCol from './BaseActivityCol';

// STYLES
import './BaseActivityColOuter.scss';

const getActivityValues = (activity, type, prop) => {
  const payload = type === 'VALUE' ? activity.values : activity.timing;
  return payload.filter(el => el.extId === prop);
};

const BaseActivityColOuter = ({
  activity,
  type,
  prop,
  propTitle,
  formatFn,
  mapping,
}) => {
  const activityValues = getActivityValues(activity, type, prop);
  const activityValueCols = activityValues && activityValues.length && (activityValues || []).reduce((activityCols, activityValue, idx) => (
    !_.isEmpty(activityValue.value) ? [...activityCols, <BaseActivityCol
      key={`av-${idx}`}
      activityValue={activityValue}
      activity={activity}
      type={type}
      prop={prop}
      propTitle={propTitle}
      formatFn={formatFn}
      mapping={mapping}
    />] : activityCols
  ), []);

  return (
    <div className="base-activity-col--outer--wrapper">
      {(activityValueCols.length
        ? activityValueCols
        : (activityValues && activityValues.length && <BaseActivityCol
          activityValue={activityValues[0]}
          activity={activity}
          type={type}
          prop={prop}
          propTitle={propTitle}
          formatFn={formatFn}
          mapping={mapping}
        />)) || 'No values'}
    </div>
  );
};

BaseActivityColOuter.propTypes = {
  activity: PropTypes.object.isRequired,
  type: PropTypes.string,
  prop: PropTypes.string.isRequired,
  propTitle: PropTypes.string,
  formatFn: PropTypes.func,
  mapping: PropTypes.object,
};

BaseActivityColOuter.defaultProps = {
  type: 'VALUE',
  propTitle: null,
  formatFn: value => value,
  mapping: null,
};

export default BaseActivityColOuter;
