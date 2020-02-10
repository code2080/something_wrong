import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Popover, Tooltip, Icon } from 'antd';

// CONSTANTS
import { submissionValueTypeProps } from '../../Constants/submissionValueTypes.constants';
import { reservationValueModeProps } from '../../Constants/reservationValueModes.constants';

const ReservationPopover = ({ reservationValue, propTitle, children }) => {
  const popoverContent = useMemo(
    () => (
      <div className="reservation-popover--wrapper">
        <div className="reservation-popover--prop-icon">
          <Tooltip
            getPopupContainer={() => document.getElementById('te-prefs-lib')}
            title={submissionValueTypeProps[reservationValue.submissionValueType].label}
          >
            <Icon type={submissionValueTypeProps[reservationValue.submissionValueType].icon} />
          </Tooltip>
        </div>
        <div className="reservation-popover--prop-icon">
          <Tooltip
            getPopupContainer={() => document.getElementById('te-prefs-lib')}
            title={reservationValueModeProps[reservationValue.valueMode].label}
          >
            <Icon type={reservationValueModeProps[reservationValue.valueMode].icon} />
          </Tooltip>
        </div>
      </div>
    ),
    [reservationValue]
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

ReservationPopover.propTypes = {
  reservationValue: PropTypes.object.isRequired,
  propTitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ReservationPopover;
