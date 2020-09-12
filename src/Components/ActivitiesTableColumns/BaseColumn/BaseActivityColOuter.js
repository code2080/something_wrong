import React from 'react';
import PropTypes from 'prop-types';

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

  return (
    <div className="base-activity-col--outer--wrapper">
      {activityValues && activityValues.length && (activityValues || []).map((activityValue, idx) => (
        <BaseActivityCol
          key={`av-${idx}`}
          activityValue={activityValue}
          activity={activity}
          type={type}
          prop={prop}
          propTitle={propTitle}
          formatFn={formatFn}
          mapping={mapping}
        />
      ))}
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
