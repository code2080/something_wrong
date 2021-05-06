import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

// CONSTANTS
import {
  activityValueModes,
  activityValueModeProps,
} from '../../../Constants/activityValueModes.constants';
import {
  submissionValueTypes,
  submissionValueTypeProps,
} from '../../../Constants/submissionValueTypes.constants';

const BaseActivityColIcon = ({ valueMode, submissionValueType }) => {
  const value = useMemo(() => {
    if (valueMode === activityValueModes.MANUAL) {
      return {
        icon: activityValueModeProps.MANUAL.icon,
        tooltip: 'Manually entered value',
      };
    }
    if (submissionValueType === submissionValueTypes.FILTER) {
      return {
        icon: submissionValueTypeProps.FILTER.icon,
        tooltip: 'Filter values from submission',
      };
    }
    return {
      icon: activityValueModeProps.FROM_SUBMISSION.icon,
      tooltip: 'Value from submission',
    };
  }, [valueMode, submissionValueType]);
  return (
    <div className='base-activity-col--icon'>
      <Tooltip
        title={value.tooltip}
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
      >
        {value.icon}
      </Tooltip>
    </div>
  );
};

BaseActivityColIcon.propTypes = {
  valueMode: PropTypes.string.isRequired,
  submissionValueType: PropTypes.string.isRequired,
};

export default BaseActivityColIcon;
