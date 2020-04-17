import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Popover, Tooltip, Icon } from 'antd';

// CONSTANTS
import { submissionValueTypeProps } from '../../Constants/submissionValueTypes.constants';
import { activityValueModeProps } from '../../Constants/activityValueModes.constants';

const ActivityPopover = ({ activityValue, propTitle, children }) => {
  const popoverContent = useMemo(
    () => (
      <div className="activity-popover--wrapper">
        <div className="activity-popover--prop-icon">
          <Tooltip
            getPopupContainer={() => document.getElementById('te-prefs-lib')}
            title={submissionValueTypeProps[activityValue.submissionValueType].label}
          >
            <Icon type={submissionValueTypeProps[activityValue.submissionValueType].icon} />
          </Tooltip>
        </div>
        <div className="activity-popover--prop-icon">
          <Tooltip
            getPopupContainer={() => document.getElementById('te-prefs-lib')}
            title={activityValueModeProps[activityValue.valueMode].label}
          >
            <Icon type={activityValueModeProps[activityValue.valueMode].icon} />
          </Tooltip>
        </div>
      </div>
    ),
    [activityValue]
  );

  return (
    <Popover
      content={popoverContent}
      title={propTitle}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      {children}
    </Popover>
  );
};

ActivityPopover.propTypes = {
  activityValue: PropTypes.object.isRequired,
  propTitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ActivityPopover;
