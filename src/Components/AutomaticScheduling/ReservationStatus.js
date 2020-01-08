import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon } from 'antd';

// CONSTANTS
import { reservationStatuses, reservationStatusProps } from '../../Constants/reservationStatuses.constants';

const ReservationStatus = ({ reservationStatus, reservationId }) => {
  if (!reservationStatus || !reservationStatuses[reservationStatus]) return null;
  return (
    <Tooltip
      title={reservationStatusProps[reservationStatus].tooltip(reservationId || null)}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      <div className={`reservation-status--wrapper ${reservationStatuses[reservationStatus]}`}>
        <Icon type={reservationStatusProps[reservationStatus].icon} />
      </div>
    </Tooltip>
  );
};

ReservationStatus.propTypes = {
  reservationStatus: PropTypes.string.isRequired,
  reservationId: PropTypes.string,
};

ReservationStatus.defaultProps = {
  reservationId: null,
};

export default ReservationStatus;
