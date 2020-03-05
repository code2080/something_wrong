import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

// HELPERS
import { getSchedulingPayloadForActivityValue } from '../../Redux/Activities/activities.helpers';

const BaseActivityColValue = ({ activityValue, activity, formatFn }) => {
  const schedulingPayload = getSchedulingPayloadForActivityValue(activityValue, activity, formatFn);
  if (schedulingPayload.tooltip)
    return (
      <Tooltip
        title={schedulingPayload.tooltip}
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
      >
        <span>{schedulingPayload.formattedValue}</span>
      </Tooltip>
    );

  return (
    <span>{schedulingPayload.formattedValue}</span>
  );
};

BaseActivityColValue.propTypes = {
  activityValue: PropTypes.object.isRequired,
  activity: PropTypes.object,
  formatFn: PropTypes.func,
};

BaseActivityColValue.defaultProps = {
  formatFn: val => val,
};

export default BaseActivityColValue;
