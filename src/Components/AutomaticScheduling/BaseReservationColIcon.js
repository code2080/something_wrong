import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon } from 'antd';

// CONSTANTS
import { reservationValueModes, reservationValueModeProps } from '../../Constants/reservationValueModes.constants';
import { submissionValueTypes, submissionValueTypeProps } from '../../Constants/submissionValueTypes.constants';

const BaseReservationColIcon = ({ valueMode, submissionValueType }) => {
  const value = useMemo(() => {
    if (valueMode === reservationValueModes.MANUAL)
      return { icon: reservationValueModeProps.MANUAL.icon, tooltip: 'Manually entered value' };
    if (submissionValueType === submissionValueTypes.FILTER)
      return { icon: submissionValueTypeProps.FILTER.icon, tooltip: 'Filter values from submission' };
    return { icon: reservationValueModeProps.FROM_SUBMISSION.icon, tooltip: 'Value from submission' };
  }, [valueMode, submissionValueType]);
  return (
    <div className="base-reservation-col--icon">
      <Tooltip
        title={value.tooltip}
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
      >
        <Icon type={value.icon} />
      </Tooltip>
    </div>
  );
};

BaseReservationColIcon.propTypes = {
  valueMode: PropTypes.string.isRequired,
  submissionValueType: PropTypes.string.isRequired,
};

export default BaseReservationColIcon;
